import { Platform } from '../entities/Platform';
import { Enemy } from '../entities/Enemy';
import { Coin } from '../entities/Coin';

export interface LevelData {
  id: number;
  name: string;
  platforms: Array<{x: number, y: number, width: number, height: number}>;
  enemies: Array<{x: number, y: number, type: 'jaguar' | 'alligator'}>;
  coins: Array<{x: number, y: number}>;
  playerStart: {x: number, y: number};
  winCondition: {x: number, y: number};
  background: string;
}

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: "Your gift card expires tomorrow",
    platforms: [
      {x: 0, y: 550, width: 200, height: 50},
      {x: 300, y: 500, width: 150, height: 20},
      {x: 500, y: 450, width: 150, height: 20},
      {x: 700, y: 400, width: 150, height: 20},
      {x: 900, y: 350, width: 150, height: 20},
      {x: 1100, y: 300, width: 150, height: 20},
      {x: 1300, y: 400, width: 200, height: 20},
      {x: 1600, y: 450, width: 150, height: 20},
      {x: 1850, y: 500, width: 150, height: 20},
      {x: 2100, y: 400, width: 300, height: 50},
      {x: -100, y: 580, width: 2500, height: 50},
    ],
    enemies: [
      {x: 400, y: 470, type: 'jaguar'},
      {x: 600, y: 420, type: 'alligator'},
      {x: 1000, y: 320, type: 'jaguar'},
      {x: 1400, y: 370, type: 'alligator'},
      {x: 1700, y: 420, type: 'jaguar'},
    ],
    coins: [
      {x: 350, y: 450},
      {x: 550, y: 400},
      {x: 750, y: 350},
      {x: 950, y: 300},
      {x: 1150, y: 250},
      {x: 1350, y: 350},
      {x: 1650, y: 400},
      {x: 1900, y: 450},
      {x: 2120, y: 350},
      {x: 2160, y: 350},
    ],
    playerStart: {x: 100, y: 400},
    winCondition: {x: 2300, y: 400},
    background: 'jungle'
  },
  {
    id: 2,
    name: "Swamp Crossing",
    platforms: [
      {x: 0, y: 550, width: 150, height: 50},
      {x: 200, y: 480, width: 100, height: 15},
      {x: 350, y: 420, width: 80, height: 15},
      {x: 480, y: 380, width: 120, height: 15},
      {x: 650, y: 320, width: 100, height: 15},
      {x: 800, y: 280, width: 150, height: 15},
      {x: 1000, y: 350, width: 100, height: 15},
      {x: 1150, y: 400, width: 120, height: 15},
      {x: 1320, y: 450, width: 100, height: 15},
      {x: 1500, y: 380, width: 150, height: 15},
      {x: 1700, y: 320, width: 200, height: 50},
      {x: -100, y: 580, width: 2000, height: 50},
    ],
    enemies: [
      {x: 250, y: 450, type: 'alligator'},
      {x: 400, y: 390, type: 'alligator'},
      {x: 700, y: 290, type: 'jaguar'},
      {x: 850, y: 250, type: 'alligator'},
      {x: 1050, y: 320, type: 'alligator'},
      {x: 1200, y: 370, type: 'jaguar'},
      {x: 1550, y: 350, type: 'alligator'},
    ],
    coins: [
      {x: 220, y: 430},
      {x: 370, y: 370},
      {x: 500, y: 330},
      {x: 670, y: 270},
      {x: 820, y: 230},
      {x: 1020, y: 300},
      {x: 1170, y: 350},
      {x: 1340, y: 400},
      {x: 1520, y: 330},
      {x: 1720, y: 270},
      {x: 1760, y: 270},
      {x: 1800, y: 270},
    ],
    playerStart: {x: 50, y: 400},
    winCondition: {x: 1800, y: 320},
    background: 'swamp'
  },
  {
    id: 3,
    name: "Mountain Peak",
    platforms: [
      {x: 0, y: 550, width: 120, height: 50},
      {x: 180, y: 500, width: 80, height: 15},
      {x: 320, y: 450, width: 100, height: 15},
      {x: 480, y: 400, width: 80, height: 15},
      {x: 620, y: 350, width: 100, height: 15},
      {x: 780, y: 300, width: 80, height: 15},
      {x: 920, y: 250, width: 120, height: 15},
      {x: 1100, y: 200, width: 100, height: 15},
      {x: 1260, y: 150, width: 150, height: 15},
      {x: 1470, y: 200, width: 100, height: 15},
      {x: 1630, y: 250, width: 120, height: 15},
      {x: 1800, y: 300, width: 200, height: 50},
      {x: -100, y: 580, width: 2200, height: 50},
    ],
    enemies: [
      {x: 200, y: 470, type: 'jaguar'},
      {x: 340, y: 420, type: 'jaguar'},
      {x: 500, y: 370, type: 'alligator'},
      {x: 640, y: 320, type: 'jaguar'},
      {x: 800, y: 270, type: 'jaguar'},
      {x: 940, y: 220, type: 'alligator'},
      {x: 1120, y: 170, type: 'jaguar'},
      {x: 1280, y: 120, type: 'jaguar'},
      {x: 1490, y: 170, type: 'alligator'},
      {x: 1650, y: 220, type: 'jaguar'},
    ],
    coins: [
      {x: 200, y: 450},
      {x: 340, y: 400},
      {x: 500, y: 350},
      {x: 640, y: 300},
      {x: 800, y: 250},
      {x: 940, y: 200},
      {x: 1120, y: 150},
      {x: 1280, y: 100},
      {x: 1490, y: 150},
      {x: 1650, y: 200},
      {x: 1820, y: 250},
      {x: 1860, y: 250},
      {x: 1900, y: 250},
      {x: 1940, y: 250},
    ],
    playerStart: {x: 50, y: 400},
    winCondition: {x: 1900, y: 300},
    background: 'mountain'
  }
];

export function createPlatformsFromData(platformData: Array<{x: number, y: number, width: number, height: number}>): Platform[] {
  return platformData.map(p => new Platform(p.x, p.y, p.width, p.height));
}

export function createEnemiesFromData(enemyData: Array<{x: number, y: number, type: 'jaguar' | 'alligator'}>): Enemy[] {
  return enemyData.map(e => new Enemy(e.x, e.y, e.type));
}

export function createCoinsFromData(coinData: Array<{x: number, y: number}>): Coin[] {
  return coinData.map(c => new Coin(c.x, c.y));
}