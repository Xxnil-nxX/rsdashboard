/**
 * RakshaSetu Frame Adapter & Normalizer
 * Bridges raw backend / WebSocket / Fusion node shapes into the uniform internal UI data contract.
 *
 * Implements Section 8 of HANDOVER_MEMBER_6_VEHICLE_DASHBOARD.md.
 */

import { FOVEATED_RANGES } from './colors.js';

/**
 * Derives cell_size_m from radial range or range_bin according to the foveated table
 * @param {number} rangeMeters - distance in meters from ego vehicle
 * @returns {number} cell size in meters
 */
export function deriveCellSizeFromRange(rangeMeters) {
  if (rangeMeters <= 10) return 0.05; // 5 cm
  if (rangeMeters <= 30) return 0.15; // 15 cm
  if (rangeMeters <= 60) return 0.30; // 30 cm
  return 0.50; // 50 cm
}

/**
 * Normalizes an incoming raw frame (from WebSocket, ROS2 bridge, or mock scenario)
 * into the strict internal UI model.
 * 
 * @param {Object} rawFrame - Raw input JSON frame
 * @returns {Object} Normalized frame matching internal specification
 */
export function normalizeFrame(rawFrame) {
  if (!rawFrame) return null;

  // 1. SCENE NORMALIZATION
  const scene = {
    scenario: rawFrame.scene?.scenario || rawFrame.scenario_name || 'Urban Drive',
    elapsed: rawFrame.scene?.elapsed || rawFrame.time_elapsed || '00:00.0',
    speed_kmh: Number(rawFrame.scene?.speed_kmh ?? rawFrame.speed_kmh ?? 20.0),
    heading_deg: Number(rawFrame.scene?.heading_deg ?? rawFrame.heading_deg ?? 0.0),
    heading_cardinal: rawFrame.scene?.heading_cardinal || (rawFrame.scene?.heading_deg < -15 ? 'W' : rawFrame.scene?.heading_deg > 15 ? 'E' : 'N'),
    position: Array.isArray(rawFrame.scene?.position)
      ? rawFrame.scene.position
      : [rawFrame.ugv_pose?.position?.x ?? 0.0, rawFrame.ugv_pose?.position?.y ?? 0.0],
    system_time: rawFrame.scene?.system_time || rawFrame.system_time || '17:55:12',
    mode: rawFrame.scene?.mode || 'SIMULATION (CARLA)',
    status: rawFrame.scene?.status || 'ONLINE',
  };

  // 2. GRID NORMALIZATION (Handles dict-of-cells -> list conversion & field derivations)
  let normalizedGrid = [];
  const rawGrid = rawFrame.grid || rawFrame.foveated_grid?.cells || rawFrame.foveated_grid || {};

  if (Array.isArray(rawGrid)) {
    normalizedGrid = rawGrid.map((cell, idx) => {
      const rangeEst = cell.distance_m ?? (cell.range_bin !== undefined ? cell.range_bin * 1.5 : (cell.r ? cell.r * 1.2 : 15));
      const cellSize = cell.cell_size_m ?? deriveCellSizeFromRange(rangeEst);
      
      // TODO: Backend Fusion node does not emit height_min yet; stubs from height_mean - 0.05m
      const heightMean = Number(cell.height_mean ?? cell.h_mean ?? cell.h_max ?? 0.0);
      const heightMin = cell.height_min !== undefined ? cell.height_min : (heightMean - 0.05);
      const heightMax = cell.height_max ?? cell.h_max ?? (heightMean + 0.1);

      return {
        id: cell.id || `cell_${idx}`,
        range_bin: cell.range_bin ?? cell.r ?? Math.floor(rangeEst / 2),
        angular_bin: cell.angular_bin ?? cell.a ?? idx % 64,
        distance_m: rangeEst,
        cell_size_m: cellSize,
        class: cell.class ?? cell.class_label ?? 1,
        height_mean: heightMean,
        height_min: heightMin,
        height_max: heightMax,
        confidence: Number(cell.confidence ?? 0.95),
        x: cell.x,
        y: cell.y,
        is_dynamic: Boolean(cell.is_dynamic)
      };
    });
  } else if (typeof rawGrid === 'object' && rawGrid !== null) {
    // Convert dictionary keyed by "{range_bin}_{angular_bin}" to a list
    normalizedGrid = Object.entries(rawGrid).map(([key, cell], idx) => {
      const [rBinStr, aBinStr] = key.split('_');
      const rBin = parseInt(rBinStr, 10) || 0;
      const aBin = parseInt(aBinStr, 10) || 0;
      const rangeEst = cell.distance_m ?? (rBin * 2.0 + 1.0);
      const cellSize = cell.cell_size_m ?? deriveCellSizeFromRange(rangeEst);

      // TODO: Backend Fusion node does not emit height_min yet; stubs from height_mean - 0.05m
      const heightMean = Number(cell.height_mean ?? cell.h_mean ?? cell.h_max ?? 0.0);
      const heightMin = cell.height_min !== undefined ? cell.height_min : (heightMean - 0.05);
      const heightMax = cell.height_max ?? cell.h_max ?? (heightMean + 0.1);

      return {
        id: `cell_${key}`,
        range_bin: rBin,
        angular_bin: aBin,
        distance_m: rangeEst,
        cell_size_m: cellSize,
        class: cell.class ?? cell.class_label ?? 1,
        height_mean: heightMean,
        height_min: heightMin,
        height_max: heightMax,
        confidence: Number(cell.confidence ?? 0.95),
        x: cell.x,
        y: cell.y,
        is_dynamic: Boolean(cell.is_dynamic)
      };
    });
  }

  // 3. OBJECTS NORMALIZATION
  const rawObjects = rawFrame.objects || rawFrame.dynamic_tracks || [];
  const normalizedObjects = rawObjects.map((obj, idx) => {
    const trackId = obj.track_id ?? obj.id ?? (idx + 1);
    const rawClass = (obj.class || obj.class_label || 'vehicle').toString().toLowerCase();

    // Map internal UI class: display 'Human' for human/pedestrian objects
    let uiClass = 'Dynamic Vehicle';
    let semanticClass = 'dynamic_vehicle';
    if (rawClass.includes('pedestrian') || rawClass.includes('human') || rawClass === '5') {
      uiClass = 'Dynamic Human';
      semanticClass = 'dynamic_human';
    } else if (rawClass.includes('pole') || rawClass === '3') {
      uiClass = 'Static Obstacle';
      semanticClass = 'static_pole';
    } else if (rawClass.includes('wall')) {
      uiClass = 'Static Wall';
      semanticClass = 'static_wall';
    } else if (rawClass.includes('pothole') || rawClass.includes('terrain')) {
      uiClass = 'Static Obstacle'; // Pothole is terrain/anomaly
      semanticClass = 'pothole';
    } else if (rawClass.includes('curb')) {
      uiClass = 'Curb';
      semanticClass = 'curb';
    }

    const pos = Array.isArray(obj.position)
      ? obj.position
      : (obj.pos ? [obj.pos.x, obj.pos.y] : [obj.x || 0, obj.y || 0]);

    const dist = obj.distance_m ?? Math.hypot(pos[0], pos[1]);
    const vel = obj.velocity_mps ?? (obj.vel ? Math.hypot(obj.vel.x, obj.vel.y) : (obj.speed || 0.0));
    const isMoving = vel > 0.1 || Boolean(obj.is_dynamic && vel > 0.05);

    return {
      track_id: trackId,
      name: obj.name || (semanticClass === 'pothole' ? `POTHOLE #${trackId}` : semanticClass === 'static_pole' ? `POLE #${trackId}` : semanticClass === 'dynamic_human' ? `HUMAN #${trackId}` : semanticClass === 'curb' ? 'CURB' : semanticClass === 'static_wall' ? 'WALL' : `VEHICLE #${trackId}`),
      class: semanticClass,
      ui_class: uiClass,
      position: pos,
      velocity_mps: Number(vel.toFixed(1)),
      distance_m: Number(dist.toFixed(1)),
      confidence: Math.round(Number(obj.confidence ?? 0.9) * 100 > 1 ? Number(obj.confidence) * (obj.confidence <= 1 ? 100 : 1) : 90),
      is_dynamic: isMoving,
      status: isMoving ? 'Moving' : 'Stationary',
      bbox: obj.bbox || obj.dims || { l: 4.2, w: 1.8, h: 1.5 },
      trail: obj.trail || [],
      radius: obj.radius || 1.2
    };
  });

  // 4. ELEVATION NORMALIZATION
  const elevation = {
    selected_cell_height_m: Number(rawFrame.elevation?.selected_cell_height_m ?? -0.22),
    local_terrain_height_m: Number(rawFrame.elevation?.local_terrain_height_m ?? -0.18)
  };

  // 5. EVENTS NORMALIZATION
  const events = (rawFrame.events || []).map(ev => ({
    timestamp: ev.timestamp || '17:55:12',
    type: ev.type || 'info',
    text: ev.text || 'System update',
    color: ev.color || '#00e676'
  }));

  // 6. METRICS NORMALIZATION (derives grid_cells & stubs memory_mb)
  const rawMetrics = rawFrame.metrics || {};
  // Derive grid_cells count from actual grid array or fallback to raw
  const derivedGridCells = rawMetrics.grid_cells ?? normalizedGrid.length ?? 13904;
  // TODO: memory_mb is not emitted by backend ROS2 yet; stubbing with plausible 418-436 MB
  const stubbedMemoryMb = rawMetrics.memory_mb ?? 436;

  const metrics = {
    fps: Math.round(rawMetrics.fps ?? 31),
    latency_ms: Math.round(rawMetrics.latency_ms ?? 32),
    miou: Number((rawMetrics.miou ?? 88.1).toFixed(1)),
    grid_cells: derivedGridCells,
    compute_savings_pct: Number((rawMetrics.compute_savings_pct ?? 63.4).toFixed(1)),
    memory_mb: stubbedMemoryMb
  };

  return {
    scene,
    grid: normalizedGrid,
    objects: normalizedObjects,
    elevation,
    events,
    metrics
  };
}
