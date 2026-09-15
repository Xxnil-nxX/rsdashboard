/**
 * Generator for RakshaSetu 300-frame (30s @ 10Hz) Continuous Sequential Dataset
 * Real time-ordered trajectory matching SemanticKITTI / CARLA driving dynamics.
 */

function generateSequence() {
  const totalFrames = 300; // 30 seconds of continuous driving
  const dt = 0.1; // 100ms per frame (10Hz)

  const frames = [];

  let egoWorldX = 20.0;
  let egoWorldY = 100.0;
  let egoHeading = 0.2; // degrees
  let egoSpeedKmh = 22.1;

  for (let i = 0; i < totalFrames; i++) {
    const t = i * dt;
    const timeFormatted = `${String(Math.floor(t / 60)).padStart(2, '0')}:${(t % 60).toFixed(1).padStart(4, '0')}`;

    // Segment classification
    let scenarioName = 'Urban Drive';
    let targetSpeed = 22.1;
    let targetHeading = 0.2;

    if (t < 8.0) {
      // Segment 1: Urban Straight Drive
      scenarioName = 'Urban Drive';
      targetSpeed = 22.1;
      targetHeading = 0.2;
    } else if (t < 16.0) {
      // Segment 2: Pothole & Curb Encounter
      scenarioName = 'Pothole Detection';
      targetSpeed = 20.4;
      targetHeading = 0.6;
    } else if (t < 25.0) {
      // Segment 3: Left Turn Intersection
      scenarioName = 'Left Turn';
      const turnProgress = (t - 16.0) / 9.0;
      targetSpeed = 16.9;
      // Smooth sinusoidal heading turn from 0.6 to -41.7 deg
      targetHeading = 0.6 - Math.sin(turnProgress * Math.PI) * 42.3;
    } else {
      // Segment 4: Dynamic Turn & Corridor Clearing
      scenarioName = 'Dynamic Turn';
      const exitProgress = (t - 25.0) / 5.0;
      targetSpeed = 18.5 + exitProgress * 3.6;
      targetHeading = -41.7 * (1.0 - exitProgress);
    }

    // Smooth physics integration
    egoSpeedKmh += (targetSpeed - egoSpeedKmh) * 0.1;
    egoHeading += (targetHeading - egoHeading) * 0.08;

    const speedMps = egoSpeedKmh / 3.6;
    const headingRad = (egoHeading * Math.PI) / 180;
    egoWorldX += Math.sin(headingRad) * speedMps * dt;
    egoWorldY += Math.cos(headingRad) * speedMps * dt;

    // Tracked Objects per frame with real continuous motion
    const objects = [];

    if (t < 10.0) {
      // Track #04 (Vehicle ahead)
      const vehRelY = 36.0 - (t * 0.4);
      objects.push({
        track_id: '04',
        name: 'VEHICLE #04',
        class: 'dynamic_vehicle',
        position: [0.0, vehRelY],
        velocity_mps: 10.8,
        distance_m: Number(Math.hypot(0.0, vehRelY).toFixed(1)),
        confidence: 0.91,
        is_dynamic: true,
        status: 'Moving',
        bbox: { l: 4.4, w: 1.9, h: 1.5 },
        trail: [[0.0, vehRelY + 5], [0.0, vehRelY + 10]]
      });

      // Track #07 (Human walking on right sidewalk)
      const humanRelY = 30.0 - (t * 0.7);
      objects.push({
        track_id: '07',
        name: 'HUMAN #07',
        class: 'dynamic_human',
        position: [5.6, humanRelY],
        velocity_mps: 1.4,
        distance_m: Number(Math.hypot(5.6, humanRelY).toFixed(1)),
        confidence: 0.88,
        is_dynamic: true,
        status: 'Moving',
        bbox: { l: 0.6, w: 0.6, h: 1.75 },
        trail: [[5.6, humanRelY + 2], [5.6, humanRelY + 4]]
      });

      // Track #11 (Pole on left curb)
      const poleRelY = 24.0 - (t * speedMps);
      if (poleRelY > -10 && poleRelY < 50) {
        objects.push({
          track_id: '11',
          name: 'POLE #11',
          class: 'static_pole',
          position: [-5.8, poleRelY],
          velocity_mps: 0.0,
          distance_m: Number(Math.hypot(-5.8, poleRelY).toFixed(1)),
          confidence: 0.95,
          is_dynamic: false,
          status: 'Stationary',
          bbox: { l: 0.4, w: 0.4, h: 3.5 }
        });
      }

      // Wall tag
      objects.push({
        track_id: 'wall',
        name: 'WALL',
        class: 'static_wall',
        position: [-10.8, 23.5],
        velocity_mps: 0.0,
        distance_m: 24.3,
        confidence: 0.98,
        is_dynamic: false,
        status: 'Stationary'
      });
    } else if (t < 18.0) {
      // Pothole segment
      const potholeRelY = 20.0 - ((t - 10.0) * speedMps * 0.75);
      if (potholeRelY > -8 && potholeRelY < 45) {
        objects.push({
          track_id: '21',
          name: 'POTHOLE #21',
          class: 'pothole',
          position: [1.6, potholeRelY],
          velocity_mps: 0.0,
          distance_m: Number(Math.hypot(1.6, potholeRelY).toFixed(1)),
          confidence: 0.93,
          is_dynamic: false,
          status: 'Stationary',
          radius: 2.2,
          bbox: { l: 2.2, w: 2.2, h: -0.22 }
        });
      }

      // Vehicle #18 ahead
      const veh18Y = 32.0 - ((t - 10.0) * 0.5);
      objects.push({
        track_id: '18',
        name: 'VEHICLE #18',
        class: 'dynamic_vehicle',
        position: [-4.2, veh18Y],
        velocity_mps: 6.1,
        distance_m: Number(Math.hypot(-4.2, veh18Y).toFixed(1)),
        confidence: 0.87,
        is_dynamic: true,
        status: 'Moving',
        bbox: { l: 4.4, w: 1.9, h: 1.5 },
        trail: [[-4.2, veh18Y + 4], [-4.2, veh18Y + 8]]
      });

      // Pole #17
      const pole17Y = 22.0 - ((t - 10.0) * speedMps * 0.8);
      if (pole17Y > -10 && pole17Y < 50) {
        objects.push({
          track_id: '17',
          name: 'POLE #17',
          class: 'static_pole',
          position: [6.8, pole17Y],
          velocity_mps: 0.0,
          distance_m: Number(Math.hypot(6.8, pole17Y).toFixed(1)),
          confidence: 0.95,
          is_dynamic: false,
          status: 'Stationary',
          bbox: { l: 0.4, w: 0.4, h: 3.5 }
        });
      }

      // Curb tag
      objects.push({
        track_id: 'curb',
        name: 'CURB',
        class: 'curb',
        position: [5.6, 18.5],
        velocity_mps: 0.0,
        distance_m: 19.2,
        confidence: 0.96,
        is_dynamic: false,
        status: 'Stationary'
      });
    } else {
      // Turn segment (Left turn & Dynamic Turn)
      const turnT = t - 18.0;

      // Track #26 (Vehicle approaching / turning)
      const v26X = -11.8 + Math.sin(turnT * 0.3) * 2.0;
      const v26Y = 20.0 - (turnT * 0.5);
      objects.push({
        track_id: '26',
        name: 'VEHICLE #26',
        class: 'dynamic_vehicle',
        position: [v26X, v26Y],
        velocity_mps: 9.6,
        distance_m: Number(Math.hypot(v26X, v26Y).toFixed(1)),
        confidence: 0.92,
        is_dynamic: true,
        status: 'Moving',
        bbox: { l: 4.4, w: 1.9, h: 1.5 },
        trail: [[v26X + 2, v26Y + 4], [v26X + 4, v26Y + 8]]
      });

      // Track #23 (Human crossing crosswalk)
      const pedX = 6.5 - (turnT * 0.9);
      const pedY = 8.7 + Math.sin(turnT * 0.2) * 1.5;
      objects.push({
        track_id: '23',
        name: 'HUMAN #23',
        class: 'dynamic_human',
        position: [pedX, pedY],
        velocity_mps: 1.3,
        distance_m: Number(Math.hypot(pedX, pedY).toFixed(1)),
        confidence: 0.85,
        is_dynamic: true,
        status: 'Moving',
        bbox: { l: 0.6, w: 0.6, h: 1.75 },
        trail: [[pedX + 1.2, pedY], [pedX + 2.4, pedY]]
      });

      // Pole #28
      objects.push({
        track_id: '28',
        name: 'POLE #28',
        class: 'static_pole',
        position: [7.8, 19.6],
        velocity_mps: 0.0,
        distance_m: 19.6,
        confidence: 0.96,
        is_dynamic: false,
        status: 'Stationary',
        bbox: { l: 0.4, w: 0.4, h: 3.5 }
      });

      // Wall tag
      objects.push({
        track_id: 'wall_turn',
        name: 'WALL',
        class: 'static_wall',
        position: [11.5, 22.4],
        velocity_mps: 0.0,
        distance_m: 25.0,
        confidence: 0.98,
        is_dynamic: false,
        status: 'Stationary'
      });
    }

    // Elevation model for scene
    let selHeight = 0.12;
    let terrHeight = 0.03;
    if (objects.some(o => o.class === 'pothole' && o.distance_m < 15)) {
      selHeight = -0.22;
      terrHeight = -0.18;
    } else if (scenarioName.includes('Turn')) {
      selHeight = 0.05;
    }

    // Dynamic metrics
    const miou = 86.5 + Math.sin(t * 0.5) * 1.8;
    const computeSavings = 62.5 + Math.cos(t * 0.4) * 1.5;
    const gridCellsCount = Math.floor(13200 + Math.sin(t * 0.8) * 800);

    frames.push({
      timestamp: Number(t.toFixed(2)),
      scene: {
        scenario: scenarioName,
        elapsed: timeFormatted,
        speed_kmh: Number(egoSpeedKmh.toFixed(1)),
        heading_deg: Number(egoHeading.toFixed(1)),
        heading_cardinal: egoHeading < -15 ? 'W' : (egoHeading > 15 ? 'E' : 'N'),
        position: [Number(egoWorldX.toFixed(1)), Number(egoWorldY.toFixed(1))],
        system_time: `17:55:${String(Math.floor(12 + (t % 48))).padStart(2, '0')}`,
        mode: 'SIMULATION (CARLA)',
        status: 'ONLINE'
      },
      objects,
      elevation: {
        selected_cell_height_m: selHeight,
        local_terrain_height_m: terrHeight
      },
      metrics: {
        fps: 31,
        latency_ms: 32,
        miou: Number(miou.toFixed(1)),
        grid_cells: gridCellsCount,
        compute_savings_pct: Number(computeSavings.toFixed(1)),
        memory_mb: 432
      }
    });
  }

  return frames;
}

export const CONTINUOUS_SEQUENCE = generateSequence();
