export enum ShapeType {
  SQUARE = 'SQUARE',
  TRIANGLE = 'TRIANGLE',
  CIRCLE = 'CIRCLE',
  RECTANGLE = 'RECTANGLE'
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export interface Vector {
  x: number;
  y: number;
}

export interface Entity {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Platform extends Entity {
  type: 'solid' | 'hazard';
}

export interface MorphZone extends Entity {
  shape: ShapeType;
  collected?: boolean; // For one-time pickups if needed, though zones are usually permanent
}

export interface LevelData {
  id: number;
  name: string;
  description: string;
  spawn: Vector;
  endGate: Entity;
  requiredEndShape: ShapeType;
  platforms: Platform[];
  morphZones: MorphZone[];
  texts: { x: number; y: number; content: string }[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}
