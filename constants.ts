import { LevelData, ShapeType } from './types';

// Physics Config
export const GRAVITY = 0.6;
export const FRICTION = 0.8;
export const MOVE_SPEED = 0.8;
export const MAX_SPEED = 8;
export const JUMP_FORCE = -12;

// Shape Stats
export const SHAPE_STATS = {
  [ShapeType.SQUARE]: {
    color: '#3b82f6', // blue-500
    width: 40,
    height: 40,
    jumpMod: 1.0,
    speedMod: 1.0,
    label: 'Standard'
  },
  [ShapeType.TRIANGLE]: {
    color: '#ef4444', // red-500
    width: 40,
    height: 40,
    jumpMod: 1.4, // High Jump
    speedMod: 1.1,
    label: 'High Jump'
  },
  [ShapeType.CIRCLE]: {
    color: '#eab308', // yellow-500
    width: 40,
    height: 40,
    jumpMod: 1.1,
    speedMod: 1.5, // Fast
    label: 'Speed'
  },
  [ShapeType.RECTANGLE]: {
    color: '#22c55e', // green-500
    width: 60,
    height: 20, // Short (Crouch)
    jumpMod: 0.8,
    speedMod: 1.0,
    label: 'Squeeze'
  }
};

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: "The Awakening",
    description: "Learn to move. Find the Triangle to jump higher.",
    spawn: { x: 50, y: 300 },
    requiredEndShape: ShapeType.TRIANGLE,
    endGate: { x: 700, y: 250, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 350, w: 800, h: 50, type: 'solid' }, // Floor
      { x: 300, y: 280, w: 100, h: 20, type: 'solid' },
      { x: 500, y: 200, w: 100, h: 20, type: 'solid' },
      { x: 700, y: 340, w: 60, h: 10, type: 'hazard' }, // Small spike test
    ],
    morphZones: [
      { x: 320, y: 220, w: 40, h: 40, shape: ShapeType.TRIANGLE }, // Pickup
    ],
    texts: [
      { x: 50, y: 200, content: "Arrow Keys to Move" },
      { x: 250, y: 150, content: "Triangles Jump Higher" },
      { x: 650, y: 180, content: "Exit as Triangle" }
    ]
  },
  {
    id: 2,
    name: "Need for Speed",
    description: "Some gaps are too wide. Become a Circle to gain momentum.",
    spawn: { x: 50, y: 300 },
    requiredEndShape: ShapeType.CIRCLE,
    endGate: { x: 720, y: 300, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 350, w: 200, h: 50, type: 'solid' },
      { x: 300, y: 350, w: 200, h: 50, type: 'solid' }, // Gap 100
      { x: 600, y: 350, w: 200, h: 50, type: 'solid' }, // Gap 100
      { x: 200, y: 390, w: 100, h: 10, type: 'hazard' }, // Spikes in gap
      { x: 500, y: 390, w: 100, h: 10, type: 'hazard' },
    ],
    morphZones: [
      { x: 100, y: 250, w: 40, h: 40, shape: ShapeType.CIRCLE }
    ],
    texts: [
      { x: 50, y: 200, content: "Circles run faster" },
      { x: 350, y: 250, content: "Speed clears gaps" }
    ]
  },
  {
    id: 3,
    name: "Claustrophobia",
    description: "The ceiling is low. The Rectangle can fit where others cannot.",
    spawn: { x: 30, y: 300 },
    requiredEndShape: ShapeType.SQUARE,
    endGate: { x: 720, y: 300, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 380, w: 800, h: 20, type: 'solid' }, // Floor
      { x: 150, y: 300, w: 400, h: 80, type: 'solid' }, // Low ceiling obstacle
      { x: 650, y: 200, w: 100, h: 20, type: 'solid' },
    ],
    morphZones: [
      { x: 80, y: 320, w: 40, h: 40, shape: ShapeType.RECTANGLE },
      { x: 600, y: 320, w: 40, h: 40, shape: ShapeType.SQUARE }
    ],
    texts: [
      { x: 50, y: 200, content: "Rectangles are short" },
      { x: 200, y: 150, content: "Crouch under here" },
      { x: 600, y: 100, content: "Return to Square" }
    ]
  },
  {
    id: 4,
    name: "The Master Test",
    description: "Combine all your abilities.",
    spawn: { x: 30, y: 500 },
    requiredEndShape: ShapeType.TRIANGLE,
    endGate: { x: 720, y: 80, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 550, w: 200, h: 50, type: 'solid' },
      // Squeeze section
      { x: 200, y: 500, w: 200, h: 100, type: 'solid' }, // Low tunnel floor
      { x: 200, y: 450, w: 200, h: 20, type: 'solid' }, // Low tunnel ceiling (Gap 30)
      
      // Speed section
      { x: 450, y: 550, w: 50, h: 20, type: 'solid' },
      { x: 600, y: 500, w: 50, h: 20, type: 'solid' },

      // High jump section
      { x: 700, y: 400, w: 100, h: 20, type: 'solid' },
      { x: 500, y: 300, w: 100, h: 20, type: 'solid' },
      { x: 650, y: 150, w: 100, h: 20, type: 'solid' }, // Target
    ],
    morphZones: [
      { x: 100, y: 480, w: 40, h: 40, shape: ShapeType.RECTANGLE }, // For tunnel
      { x: 420, y: 480, w: 40, h: 40, shape: ShapeType.CIRCLE }, // For jumps
      { x: 520, y: 240, w: 40, h: 40, shape: ShapeType.TRIANGLE }, // For final climb
    ],
    texts: [
      { x: 50, y: 400, content: "Squeeze -> Speed -> Jump" }
    ]
  },
  {
    id: 5,
    name: "Precision Peaks",
    description: "Small platforms require the Triangle's height.",
    spawn: { x: 30, y: 400 },
    requiredEndShape: ShapeType.TRIANGLE,
    endGate: { x: 720, y: 250, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 450, w: 150, h: 20, type: 'solid' },
      // Islands
      { x: 200, y: 400, w: 60, h: 20, type: 'solid' },
      { x: 350, y: 350, w: 60, h: 20, type: 'solid' },
      { x: 500, y: 300, w: 60, h: 20, type: 'solid' },
      { x: 650, y: 330, w: 150, h: 20, type: 'solid' }, // Landing
      
      // Hazard Floor
      { x: 100, y: 580, w: 700, h: 20, type: 'hazard' }
    ],
    morphZones: [
      { x: 80, y: 400, w: 40, h: 40, shape: ShapeType.TRIANGLE }
    ],
    texts: [
      { x: 200, y: 250, content: "Watch your step" }
    ]
  },
  {
    id: 6,
    name: "Morph Madness",
    description: "Rapid transformation is key.",
    spawn: { x: 30, y: 500 },
    requiredEndShape: ShapeType.CIRCLE,
    endGate: { x: 720, y: 350, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 550, w: 180, h: 50, type: 'solid' }, // Start
      
      // "Under" Tunnel - Corrected
      { x: 180, y: 480, w: 180, h: 40, type: 'solid' }, // Ceiling (y=480, ends 520)
      { x: 180, y: 550, w: 180, h: 50, type: 'solid' }, // Floor (y=550) - Gap is 30
      
      // Hazard after tunnel to catch players rushing
      { x: 360, y: 550, w: 40, h: 50, type: 'solid' }, // Step down
      { x: 400, y: 590, w: 100, h: 10, type: 'hazard' }, // Spike pit
      
      // "Over" High Wall
      { x: 500, y: 400, w: 20, h: 200, type: 'solid' },
      
      // "Across" Gap landing
      { x: 550, y: 450, w: 250, h: 20, type: 'solid' },
    ],
    morphZones: [
      { x: 100, y: 500, w: 40, h: 40, shape: ShapeType.RECTANGLE }, // For tunnel
      { x: 420, y: 500, w: 40, h: 40, shape: ShapeType.TRIANGLE }, // For wall
      { x: 530, y: 300, w: 40, h: 40, shape: ShapeType.CIRCLE }, // For end speed
    ],
    texts: [
      { x: 200, y: 460, content: "Squeeze Under" },
      { x: 380, y: 540, content: "Jump!" },
      { x: 450, y: 350, content: "Climb Over" }
    ]
  },
  {
    id: 7,
    name: "The Final Gauntlet",
    description: "One mistake means failure.",
    spawn: { x: 30, y: 300 },
    requiredEndShape: ShapeType.SQUARE,
    endGate: { x: 740, y: 500, w: 40, h: 60 },
    platforms: [
      { x: 0, y: 350, w: 100, h: 20, type: 'solid' }, // Start
      
      // Precision jumps
      { x: 150, y: 350, w: 40, h: 20, type: 'solid' },
      { x: 250, y: 300, w: 40, h: 20, type: 'solid' },
      
      // Ceiling Tunnel
      { x: 350, y: 300, w: 200, h: 20, type: 'solid' }, // Floor
      { x: 350, y: 250, w: 200, h: 10, type: 'solid' }, // Ceiling
      
      // Long drop to bounce
      { x: 600, y: 400, w: 100, h: 20, type: 'solid' },
      
      // Spikes
      { x: 100, y: 580, w: 600, h: 20, type: 'hazard' },
      { x: 380, y: 280, w: 140, h: 10, type: 'hazard' }, // Tunnel hazard
    ],
    morphZones: [
      { x: 250, y: 250, w: 40, h: 40, shape: ShapeType.RECTANGLE }, // Tunnel
      { x: 560, y: 250, w: 40, h: 40, shape: ShapeType.CIRCLE }, // Speed for last jump
      { x: 700, y: 350, w: 30, h: 30, shape: ShapeType.SQUARE }, // Reset
    ],
    texts: [
      { x: 50, y: 200, content: "Good Luck." }
    ]
  },
  {
    id: 8,
    name: "The Filter",
    description: "You must fit through the holes in the floor. Think fast.",
    spawn: { x: 50, y: 50 },
    requiredEndShape: ShapeType.CIRCLE,
    endGate: { x: 700, y: 500, w: 60, h: 60 },
    platforms: [
      { x: 0, y: 100, w: 200, h: 20, type: 'solid' }, // Start Ledge
      
      // Layer 1 - Only Triangle fits (gap 40, but needs jump)
      { x: 100, y: 200, w: 300, h: 20, type: 'solid' }, 
      { x: 450, y: 200, w: 350, h: 20, type: 'solid' },
      
      // Layer 2 - Only Rectangle fits (Squeeze tunnel)
      { x: 0, y: 350, w: 300, h: 20, type: 'solid' },
      { x: 0, y: 300, w: 300, h: 10, type: 'solid' }, // Ceiling
      
      // Layer 3 - Circle Speed Jump
      { x: 350, y: 450, w: 100, h: 20, type: 'solid' },
      { x: 650, y: 550, w: 150, h: 20, type: 'solid' }, // Exit platform
      
      { x: 0, y: 590, w: 800, h: 10, type: 'hazard' } // Floor kills you
    ],
    morphZones: [
      { x: 250, y: 150, w: 40, h: 40, shape: ShapeType.TRIANGLE },
      { x: 50, y: 250, w: 40, h: 40, shape: ShapeType.RECTANGLE },
      { x: 380, y: 400, w: 40, h: 40, shape: ShapeType.CIRCLE }
    ],
    texts: [
      { x: 250, y: 80, content: "Drop & Morph" }
    ]
  },
  {
    id: 9,
    name: "Momentum",
    description: "Inertia is your friend. Do not stop moving.",
    spawn: { x: 30, y: 300 },
    requiredEndShape: ShapeType.SQUARE,
    endGate: { x: 720, y: 200, w: 50, h: 50 },
    platforms: [
      { x: 0, y: 350, w: 150, h: 20, type: 'solid' },
      
      // The Big Jump - Requires Circle max speed
      { x: 350, y: 350, w: 100, h: 20, type: 'solid' },
      
      // The Staircase
      { x: 550, y: 300, w: 50, h: 20, type: 'solid' },
      { x: 650, y: 250, w: 50, h: 20, type: 'solid' },
      
      // Spikes below
      { x: 150, y: 550, w: 500, h: 20, type: 'hazard' },
      
      // Floating blocker - Must go under then jump
      { x: 300, y: 250, w: 20, h: 100, type: 'solid' }
    ],
    morphZones: [
      { x: 80, y: 300, w: 40, h: 40, shape: ShapeType.CIRCLE },
      { x: 555, y: 250, w: 30, h: 30, shape: ShapeType.TRIANGLE }, // To climb last steps
      { x: 660, y: 200, w: 30, h: 30, shape: ShapeType.SQUARE }
    ],
    texts: [
      { x: 200, y: 200, content: "Build Speed -> Jump Far" }
    ]
  },
  {
    id: 10,
    name: "Ascension",
    description: "The ultimate test of agility. Up we go.",
    spawn: { x: 400, y: 500 },
    requiredEndShape: ShapeType.TRIANGLE,
    endGate: { x: 380, y: 50, w: 40, h: 40 },
    platforms: [
      { x: 350, y: 550, w: 100, h: 20, type: 'solid' },
      
      // Level 1: Left or Right
      { x: 200, y: 500, w: 80, h: 20, type: 'solid' },
      { x: 520, y: 500, w: 80, h: 20, type: 'solid' },
      
      // Level 2: Center Squeeze
      { x: 300, y: 400, w: 200, h: 20, type: 'solid' },
      { x: 300, y: 350, w: 200, h: 10, type: 'solid' }, // Ceiling
      
      // Level 3: Split Jumps
      { x: 150, y: 250, w: 50, h: 20, type: 'solid' },
      { x: 600, y: 250, w: 50, h: 20, type: 'solid' },
      
      // Level 4: Final Peak
      { x: 350, y: 150, w: 100, h: 20, type: 'solid' },
      
      // Hazards
      { x: 0, y: 590, w: 350, h: 10, type: 'hazard' },
      { x: 450, y: 590, w: 350, h: 10, type: 'hazard' },
      { x: 380, y: 380, w: 40, h: 10, type: 'hazard' }, // In the squeeze tunnel!
    ],
    morphZones: [
      { x: 220, y: 460, w: 40, h: 40, shape: ShapeType.TRIANGLE },
      { x: 540, y: 460, w: 40, h: 40, shape: ShapeType.TRIANGLE },
      
      { x: 150, y: 300, w: 40, h: 40, shape: ShapeType.RECTANGLE }, // Squeeze prep
      
      { x: 380, y: 100, w: 40, h: 40, shape: ShapeType.TRIANGLE } // Final form
    ],
    texts: [
      { x: 360, y: 520, content: "Climb" },
      { x: 360, y: 320, content: "Watch Head" }
    ]
  }
];