/**
 * Deterministic Scenario Definitions for RakshaSetu Demo
 * Exactly matches Reference Frames 01, 02, 03, 04 from the brief and screenshots.
 */

export const SCENARIOS = [
  // -------------------------------------------------------------
  // FRAME 1: Urban Straight Drive (01_urban_drive_straight.png)
  // -------------------------------------------------------------
  {
    id: 'urban_straight',
    title: 'Frame 1: Urban Straight Drive',
    scenario_name: 'Urban Drive',
    selected_object_id: '04',
    raw_payload: {
      scene: {
        scenario: 'Urban Drive',
        elapsed: '00:12.7',
        speed_kmh: 22.1,
        heading_deg: 0.2,
        heading_cardinal: 'N',
        position: [28.4, 112.6],
        system_time: '17:54:21',
        mode: 'SIMULATION (CARLA)',
        status: 'ONLINE'
      },
      objects: [
        {
          id: '04',
          track_id: '04',
          name: 'VEHICLE #04',
          class: 'dynamic_vehicle',
          position: [0.0, 32.6],
          velocity_mps: 10.8,
          distance_m: 32.6,
          confidence: 0.91,
          is_dynamic: true,
          status: 'Moving',
          bbox: { l: 4.4, w: 1.9, h: 1.5 },
          trail: [[0.0, 27], [0.0, 22], [0.0, 17]]
        },
        {
          id: '07',
          track_id: '07',
          name: 'HUMAN #07',
          class: 'dynamic_human',
          position: [5.6, 25.1],
          velocity_mps: 1.4,
          distance_m: 25.1,
          confidence: 0.88,
          is_dynamic: true,
          status: 'Moving',
          bbox: { l: 0.6, w: 0.6, h: 1.75 },
          trail: [[5.4, 23.5], [5.2, 21.8]]
        },
        {
          id: '11',
          track_id: '11',
          name: 'POLE #11',
          class: 'static_pole',
          position: [-5.8, 18.3],
          velocity_mps: 0.0,
          distance_m: 18.3,
          confidence: 0.95,
          is_dynamic: false,
          status: 'Stationary',
          bbox: { l: 0.4, w: 0.4, h: 3.5 }
        },
        {
          id: 'wall_left',
          track_id: 'wall',
          name: 'WALL',
          class: 'static_wall',
          position: [-10.8, 23.5],
          velocity_mps: 0.0,
          distance_m: 24.3,
          confidence: 0.98,
          is_dynamic: false,
          status: 'Stationary'
        }
      ],
      elevation: {
        selected_cell_height_m: 0.12,
        local_terrain_height_m: 0.03
      },
      events: [
        { timestamp: '17:54:18', type: 'vehicle', text: 'Vehicle #04 detected', color: '#00e676' },
        { timestamp: '17:54:19', type: 'pole', text: 'Pole #11 detected', color: '#a3e635' },
        { timestamp: '17:54:20', type: 'drivable', text: 'Drivable area updated', color: '#00e676' },
        { timestamp: '17:54:20', type: 'human', text: 'Human #07 detected', color: '#ef4444' },
        { timestamp: '17:54:21', type: 'wall', text: 'Static wall detected', color: '#f97316' }
      ],
      metrics: {
        fps: 30,
        latency_ms: 34,
        miou: 86.9,
        grid_cells: 12704,
        compute_savings_pct: 61.8,
        memory_mb: 418
      }
    }
  },

  // -------------------------------------------------------------
  // FRAME 2: Left Turn (02_left_turn.png)
  // -------------------------------------------------------------
  {
    id: 'left_turn',
    title: 'Frame 2: Left Turn Intersection',
    scenario_name: 'Left Turn',
    selected_object_id: '23',
    raw_payload: {
      scene: {
        scenario: 'Left Turn',
        elapsed: '01:28.6',
        speed_kmh: 16.9,
        heading_deg: -41.7,
        heading_cardinal: 'W',
        position: [-12.3, 241.6],
        system_time: '17:55:37',
        mode: 'SIMULATION (CARLA)',
        status: 'ONLINE'
      },
      objects: [
        {
          id: '26',
          track_id: '26',
          name: 'VEHICLE #26',
          class: 'dynamic_vehicle',
          position: [-11.8, 16.1],
          velocity_mps: 9.6,
          distance_m: 16.1,
          confidence: 0.92,
          is_dynamic: true,
          status: 'Moving',
          bbox: { l: 4.4, w: 1.9, h: 1.5 },
          trail: [[-7.5, 12], [-3.5, 8]]
        },
        {
          id: '23',
          track_id: '23',
          name: 'HUMAN #23',
          class: 'dynamic_human',
          position: [4.4, 8.7],
          velocity_mps: 1.3,
          distance_m: 8.7,
          confidence: 0.85,
          is_dynamic: true,
          status: 'Moving',
          bbox: { l: 0.6, w: 0.6, h: 1.75 },
          trail: [[4.0, 7.2], [3.6, 5.8]]
        },
        {
          id: 'wall_top',
          track_id: 'wall_top',
          name: 'WALL',
          class: 'static_wall',
          position: [11.5, 22.4],
          velocity_mps: 0.0,
          distance_m: 25.0,
          confidence: 0.98,
          is_dynamic: false,
          status: 'Stationary'
        }
      ],
      elevation: {
        selected_cell_height_m: 0.05,
        local_terrain_height_m: 0.03
      },
      events: [
        { timestamp: '17:55:34', type: 'vehicle', text: 'Vehicle #26 detected', color: '#ef4444' },
        { timestamp: '17:55:35', type: 'human', text: 'Human #23 detected', color: '#facc15' },
        { timestamp: '17:55:35', type: 'drivable', text: 'Drivable area updated', color: '#00e676' },
        { timestamp: '17:55:36', type: 'wall', text: 'Static wall detected', color: '#ef4444' },
        { timestamp: '17:55:37', type: 'turn', text: 'Left turn in progress', color: '#f97316' }
      ],
      metrics: {
        fps: 28,
        latency_ms: 39,
        miou: 87.8,
        grid_cells: 13412,
        compute_savings_pct: 62.9,
        memory_mb: 428
      }
    }
  },

  // -------------------------------------------------------------
  // FRAME 3: Pothole Detection (03_pothole_detection.png)
  // -------------------------------------------------------------
  {
    id: 'pothole_detection',
    title: 'Frame 3: Pothole & Curb Detection',
    scenario_name: 'Urban Drive',
    selected_object_id: '21',
    raw_payload: {
      scene: {
        scenario: 'Urban Drive',
        elapsed: '01:03.8',
        speed_kmh: 20.4,
        heading_deg: 0.6,
        heading_cardinal: 'N',
        position: [16.8, 128.1],
        system_time: '17:55:12',
        mode: 'SIMULATION (CARLA)',
        status: 'ONLINE'
      },
      objects: [
        {
          id: '18',
          track_id: '18',
          name: 'VEHICLE #18',
          class: 'dynamic_vehicle',
          position: [-4.2, 28.4],
          velocity_mps: 6.1,
          distance_m: 28.4,
          confidence: 0.87,
          is_dynamic: true,
          status: 'Moving',
          bbox: { l: 4.4, w: 1.9, h: 1.5 },
          trail: [[-4.2, 24], [-4.2, 19]]
        },
        {
          id: '21',
          track_id: '21',
          name: 'POTHOLE #21',
          class: 'pothole',
          position: [1.6, 9.8],
          velocity_mps: 0.0,
          distance_m: 9.8,
          confidence: 0.93,
          is_dynamic: false,
          status: 'Stationary',
          radius: 2.2,
          bbox: { l: 2.2, w: 2.2, h: -0.22 }
        },
        {
          id: '17',
          track_id: '17',
          name: 'POLE #17',
          class: 'static_pole',
          position: [6.8, 14.2],
          velocity_mps: 0.0,
          distance_m: 14.2,
          confidence: 0.95,
          is_dynamic: false,
          status: 'Stationary',
          bbox: { l: 0.4, w: 0.4, h: 3.5 }
        },
        {
          id: 'curb_tag',
          track_id: 'curb',
          name: 'CURB',
          class: 'curb',
          position: [5.6, 18.5],
          velocity_mps: 0.0,
          distance_m: 19.2,
          confidence: 0.96,
          is_dynamic: false,
          status: 'Stationary'
        }
      ],
      elevation: {
        selected_cell_height_m: -0.22,
        local_terrain_height_m: -0.18
      },
      events: [
        { timestamp: '17:55:09', type: 'pothole', text: 'Pothole #21 detected', color: '#c084fc' },
        { timestamp: '17:55:10', type: 'curb', text: 'Curb detected', color: '#00f2fe' },
        { timestamp: '17:55:11', type: 'pole', text: 'Pole #17 detected', color: '#ef4444' },
        { timestamp: '17:55:11', type: 'vehicle', text: 'Vehicle #18 detected', color: '#facc15' },
        { timestamp: '17:55:12', type: 'drivable', text: 'Drivable area updated', color: '#00e676' }
      ],
      metrics: {
        fps: 31,
        latency_ms: 32,
        miou: 88.1,
        grid_cells: 13904,
        compute_savings_pct: 63.4,
        memory_mb: 436
      }
    }
  },

  // -------------------------------------------------------------
  // FRAME 4: Dynamic Turn (04_dynamic_turn.png)
  // -------------------------------------------------------------
  {
    id: 'dynamic_turn',
    title: 'Frame 4: Dynamic Vehicle + Pedestrian Turn',
    scenario_name: 'Dynamic Turn',
    selected_object_id: '26',
    raw_payload: {
      scene: {
        scenario: 'Dynamic Turn',
        elapsed: '01:45.2',
        speed_kmh: 18.5,
        heading_deg: -28.4,
        heading_cardinal: 'W',
        position: [-5.8, 268.4],
        system_time: '17:56:05',
        mode: 'SIMULATION (CARLA)',
        status: 'ONLINE'
      },
      objects: [
        {
          id: '26',
          track_id: '26',
          name: 'VEHICLE #26',
          class: 'dynamic_vehicle',
          position: [-8.4, 22.3],
          velocity_mps: 8.4,
          distance_m: 22.3,
          confidence: 0.94,
          is_dynamic: true,
          status: 'Moving',
          bbox: { l: 4.4, w: 1.9, h: 1.5 },
          trail: [[-6, 17], [-3, 11]]
        },
        {
          id: '23',
          track_id: '23',
          name: 'HUMAN #23',
          class: 'dynamic_human',
          position: [3.4, 14.2],
          velocity_mps: 1.2,
          distance_m: 14.2,
          confidence: 0.89,
          is_dynamic: true,
          status: 'Moving',
          bbox: { l: 0.6, w: 0.6, h: 1.75 },
          trail: [[3.0, 12.0], [2.6, 9.8]]
        },
        {
          id: '28',
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
        },
        {
          id: 'wall_right',
          track_id: 'wall',
          name: 'WALL',
          class: 'static_wall',
          position: [12.0, 26.0],
          velocity_mps: 0.0,
          distance_m: 28.6,
          confidence: 0.97,
          is_dynamic: false,
          status: 'Stationary'
        }
      ],
      elevation: {
        selected_cell_height_m: 0.02,
        local_terrain_height_m: 0.00
      },
      events: [
        { timestamp: '17:56:01', type: 'vehicle', text: 'Dynamic track #26 updated', color: '#facc15' },
        { timestamp: '17:56:02', type: 'human', text: 'Human #23 crossing road', color: '#f97316' },
        { timestamp: '17:56:03', type: 'pole', text: 'Pole #28 detected', color: '#ef4444' },
        { timestamp: '17:56:04', type: 'foveated', text: 'Foveated grid: 64.2% compute savings', color: '#00f2fe' },
        { timestamp: '17:56:05', type: 'drivable', text: 'Forward trajectory clear', color: '#00e676' }
      ],
      metrics: {
        fps: 32,
        latency_ms: 30,
        miou: 89.2,
        grid_cells: 14120,
        compute_savings_pct: 64.2,
        memory_mb: 432
      }
    }
  }
];
