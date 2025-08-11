export interface LevelData {
  id: number;
  name: string;
  unlocked: boolean;
  completed: boolean;
  platforms: Array<{x: number, y: number, width: number, height: number}>;
  enemies: Array<{x: number, y: number, type: 'jaguar' | 'alligator'}>;
  coins: Array<{x: number, y: number}>;
  playerStart: {x: number, y: number};
  winCondition: {x: number, y: number};
}

export class LevelManager {
  private levels: LevelData[] = [];
  private currentLevel: number = 1;
  private unlockedLevels: Set<number> = new Set([1]);
  private completedLevels: Set<number> = new Set();

  constructor() {
    this.initializeLevels();
    this.loadProgress();
  }

  private initializeLevels() {
    // Level 1 - Original level
    this.levels.push({
      id: 1,
      name: "Jungle Adventure",
      unlocked: true,
      completed: false,
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
      winCondition: {x: 2300, y: 400}
    });

    // Level 2 - More challenging
    this.levels.push({
      id: 2,
      name: "Swamp Crossing",
      unlocked: false,
      completed: false,
      platforms: [
        {x: 0, y: 550, width: 150, height: 50},
        {x: 200, y: 480, width: 100, height: 15},
        {x: 350, y: 420, width: 80, height: 15},
        {x: 480, y: 380, width: 100, height: 15},
        {x: 630, y: 320, width: 80, height: 15},
        {x: 760, y: 280, width: 120, height: 15},
        {x: 930, y: 240, width: 80, height: 15},
        {x: 1060, y: 300, width: 100, height: 15},
        {x: 1210, y: 360, width: 80, height: 15},
        {x: 1340, y: 420, width: 120, height: 15},
        {x: 1510, y: 380, width: 100, height: 15},
        {x: 1660, y: 320, width: 80, height: 15},
        {x: 1790, y: 280, width: 150, height: 15},
        {x: 1990, y: 350, width: 200, height: 50},
        {x: -100, y: 580, width: 2300, height: 50},
      ],
      enemies: [
        {x: 250, y: 450, type: 'alligator'},
        {x: 500, y: 350, type: 'jaguar'},
        {x: 780, y: 250, type: 'alligator'},
        {x: 1080, y: 270, type: 'jaguar'},
        {x: 1360, y: 390, type: 'alligator'},
        {x: 1680, y: 290, type: 'jaguar'},
        {x: 1810, y: 250, type: 'alligator'},
      ],
      coins: [
        {x: 220, y: 430},
        {x: 370, y: 370},
        {x: 500, y: 330},
        {x: 650, y: 270},
        {x: 780, y: 230},
        {x: 950, y: 190},
        {x: 1080, y: 250},
        {x: 1230, y: 310},
        {x: 1360, y: 370},
        {x: 1530, y: 330},
        {x: 1680, y: 270},
        {x: 1810, y: 230},
        {x: 2010, y: 300},
        {x: 2050, y: 300},
      ],
      playerStart: {x: 50, y: 400},
      winCondition: {x: 2100, y: 350}
    });

    // Level 3 - Advanced platforming
    this.levels.push({
      id: 3,
      name: "Mountain Peak",
      unlocked: false,
      completed: false,
      platforms: [
        {x: 0, y: 550, width: 120, height: 50},
        {x: 180, y: 500, width: 60, height: 15},
        {x: 280, y: 450, width: 60, height: 15},
        {x: 380, y: 400, width: 60, height: 15},
        {x: 480, y: 350, width: 60, height: 15},
        {x: 580, y: 300, width: 60, height: 15},
        {x: 680, y: 250, width: 60, height: 15},
        {x: 780, y: 200, width: 80, height: 15},
        {x: 900, y: 150, width: 100, height: 15},
        {x: 1050, y: 200, width: 60, height: 15},
        {x: 1150, y: 250, width: 60, height: 15},
        {x: 1250, y: 300, width: 60, height: 15},
        {x: 1350, y: 350, width: 60, height: 15},
        {x: 1450, y: 400, width: 60, height: 15},
        {x: 1550, y: 450, width: 60, height: 15},
        {x: 1650, y: 500, width: 200, height: 50},
        {x: -100, y: 580, width: 2000, height: 50},
      ],
      enemies: [
        {x: 200, y: 470, type: 'jaguar'},
        {x: 400, y: 370, type: 'alligator'},
        {x: 600, y: 270, type: 'jaguar'},
        {x: 920, y: 120, type: 'alligator'},
        {x: 1170, y: 220, type: 'jaguar'},
        {x: 1370, y: 320, type: 'alligator'},
        {x: 1570, y: 420, type: 'jaguar'},
      ],
      coins: [
        {x: 200, y: 450},
        {x: 300, y: 400},
        {x: 400, y: 350},
        {x: 500, y: 300},
        {x: 600, y: 250},
        {x: 700, y: 200},
        {x: 800, y: 150},
        {x: 920, y: 100},
        {x: 1070, y: 150},
        {x: 1170, y: 200},
        {x: 1270, y: 250},
        {x: 1370, y: 300},
        {x: 1470, y: 350},
        {x: 1570, y: 400},
        {x: 1670, y: 450},
        {x: 1710, y: 450},
      ],
      playerStart: {x: 50, y: 400},
      winCondition: {x: 1750, y: 500}
    });
  }

  public getCurrentLevel(): LevelData {
    return this.levels[this.currentLevel - 1];
  }

  public setCurrentLevel(levelId: number) {
    if (this.isLevelUnlocked(levelId)) {
      this.currentLevel = levelId;
    }
  }

  public completeLevel(levelId: number) {
    this.completedLevels.add(levelId);
    if (levelId < this.levels.length) {
      this.unlockedLevels.add(levelId + 1);
    }
    this.saveProgress();
  }

  public isLevelUnlocked(levelId: number): boolean {
    return this.unlockedLevels.has(levelId);
  }

  public isLevelCompleted(levelId: number): boolean {
    return this.completedLevels.has(levelId);
  }

  public getAllLevels(): LevelData[] {
    return this.levels.map(level => ({
      ...level,
      unlocked: this.isLevelUnlocked(level.id),
      completed: this.isLevelCompleted(level.id)
    }));
  }

  public getCurrentLevelNumber(): number {
    return this.currentLevel;
  }

  public getTotalLevels(): number {
    return this.levels.length;
  }

  private saveProgress() {
    const progress = {
      unlockedLevels: Array.from(this.unlockedLevels),
      completedLevels: Array.from(this.completedLevels)
    };
    localStorage.setItem('rexGameProgress', JSON.stringify(progress));
  }

  private loadProgress() {
    const saved = localStorage.getItem('rexGameProgress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        this.unlockedLevels = new Set(progress.unlockedLevels || [1]);
        this.completedLevels = new Set(progress.completedLevels || []);
      } catch (e) {
        // If parsing fails, start fresh
        this.unlockedLevels = new Set([1]);
        this.completedLevels = new Set();
      }
    }
  }
}