/**
 * Sequence Interpolator Engine
 * Performs 60 FPS sub-frame linear interpolation between 10 Hz time-ordered dataset frames.
 * Matches tracked objects across frames by track_id (not array index).
 */

export class SequenceInterpolator {
  constructor(frames) {
    this.frames = frames || [];
    this.totalDuration = this.frames.length > 0 
      ? this.frames[this.frames.length - 1].timestamp 
      : 0;
  }

  /**
   * Samples the continuous trajectory at exact time `timeSec`
   * @param {number} timeSec - Playback time in seconds
   * @returns {Object} Linearly interpolated frame for 60 FPS rendering
   */
  getInterpolatedFrame(timeSec) {
    if (!this.frames || this.frames.length === 0) return null;

    // Handle looping seamlessly
    const clampedTime = this.totalDuration > 0 ? (timeSec % this.totalDuration) : 0;

    // Find the two bounding frames: frames[idxA].timestamp <= clampedTime <= frames[idxB].timestamp
    let idxA = 0;
    while (idxA < this.frames.length - 1 && this.frames[idxA + 1].timestamp <= clampedTime) {
      idxA++;
    }
    const idxB = Math.min(idxA + 1, this.frames.length - 1);

    const frameA = this.frames[idxA];
    const frameB = this.frames[idxB];

    if (idxA === idxB || frameA.timestamp === frameB.timestamp) {
      return frameA;
    }

    // Interpolation factor alpha in [0, 1]
    const dt = frameB.timestamp - frameA.timestamp;
    const alpha = Math.max(0, Math.min(1, (clampedTime - frameA.timestamp) / dt));

    // 1. Interpolate Ego Scene State (Speed, Heading, Position)
    const sceneA = frameA.scene || {};
    const sceneB = frameB.scene || {};

    const speedKmh = lerp(sceneA.speed_kmh || 20, sceneB.speed_kmh || 20, alpha);
    const headingDeg = lerp(sceneA.heading_deg || 0, sceneB.heading_deg || 0, alpha);
    const posX = lerp(sceneA.position?.[0] || 0, sceneB.position?.[0] || 0, alpha);
    const posY = lerp(sceneA.position?.[1] || 0, sceneB.position?.[1] || 0, alpha);

    const scene = {
      scenario: sceneA.scenario || 'Urban Drive',
      elapsed: formatTime(clampedTime),
      speed_kmh: Number(speedKmh.toFixed(1)),
      heading_deg: Number(headingDeg.toFixed(1)),
      heading_cardinal: headingDeg < -15 ? 'W' : (headingDeg > 15 ? 'E' : 'N'),
      position: [Number(posX.toFixed(1)), Number(posY.toFixed(1))],
      system_time: sceneA.system_time || '17:55:12',
      mode: 'SIMULATION (CARLA)',
      status: 'ONLINE'
    };

    // 2. Interpolate Tracked Objects by track_id matching
    const objectsA = frameA.objects || [];
    const objectsB = frameB.objects || [];
    const mapB = new Map(objectsB.map(obj => [String(obj.track_id), obj]));

    const interpolatedObjects = [];

    // Process all objects in frameA
    objectsA.forEach(objA => {
      const idKey = String(objA.track_id);
      if (mapB.has(idKey)) {
        const objB = mapB.get(idKey);
        mapB.delete(idKey);

        // Interpolate position and metrics
        const ix = lerp(objA.position[0], objB.position[0], alpha);
        const iy = lerp(objA.position[1], objB.position[1], alpha);
        const iv = lerp(objA.velocity_mps || 0, objB.velocity_mps || 0, alpha);
        const idist = Math.hypot(ix, iy);

        // Interpolate trail points if present
        const trail = objA.trail || [];

        interpolatedObjects.push({
          ...objA,
          position: [Number(ix.toFixed(2)), Number(iy.toFixed(2))],
          velocity_mps: Number(iv.toFixed(1)),
          distance_m: Number(idist.toFixed(1)),
          trail
        });
      } else {
        // Fading out object that left in frame B
        if (alpha < 0.8) {
          interpolatedObjects.push(objA);
        }
      }
    });

    // Add new objects that appeared in frameB
    mapB.forEach(objB => {
      if (alpha > 0.2) {
        interpolatedObjects.push(objB);
      }
    });

    // 3. Interpolate Elevation
    const elevA = frameA.elevation || {};
    const elevB = frameB.elevation || {};
    const elevation = {
      selected_cell_height_m: Number(lerp(elevA.selected_cell_height_m || 0.12, elevB.selected_cell_height_m || 0.12, alpha).toFixed(2)),
      local_terrain_height_m: Number(lerp(elevA.local_terrain_height_m || 0.03, elevB.local_terrain_height_m || 0.03, alpha).toFixed(2))
    };

    // 4. Metrics
    const metA = frameA.metrics || {};
    const metB = frameB.metrics || {};
    const metrics = {
      fps: Math.round(lerp(metA.fps || 31, metB.fps || 31, alpha)),
      latency_ms: Math.round(lerp(metA.latency_ms || 32, metB.latency_ms || 32, alpha)),
      miou: Number(lerp(metA.miou || 88.1, metB.miou || 88.1, alpha).toFixed(1)),
      grid_cells: Math.round(lerp(metA.grid_cells || 13904, metB.grid_cells || 13904, alpha)),
      compute_savings_pct: Number(lerp(metA.compute_savings_pct || 63.4, metB.compute_savings_pct || 63.4, alpha).toFixed(1)),
      memory_mb: Math.round(lerp(metA.memory_mb || 432, metB.memory_mb || 432, alpha))
    };

    return {
      timestamp: clampedTime,
      scene,
      objects: interpolatedObjects,
      elevation,
      metrics
    };
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(1);
  return `${String(m).padStart(2, '0')}:${s.padStart(4, '0')}`;
}
