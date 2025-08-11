export interface GameState {
  currentLevel: number;
  unlockedLevels: number[];
  score: number;
  lives: number;
}

export class GameStateManager {
  private static readonly STORAGE_KEY = 'rex-game-state';
  
  public static saveGameState(state: GameState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }
  
  public static loadGameState(): GameState {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved game state');
      }
    }
    
    // Default state
    return {
      currentLevel: 1,
      unlockedLevels: [1],
      score: 0,
      lives: 3
    };
  }
  
  public static unlockLevel(level: number): void {
    const state = this.loadGameState();
    if (!state.unlockedLevels.includes(level)) {
      state.unlockedLevels.push(level);
      state.unlockedLevels.sort((a, b) => a - b);
      this.saveGameState(state);
    }
  }
  
  public static setCurrentLevel(level: number): void {
    const state = this.loadGameState();
    state.currentLevel = level;
    this.saveGameState(state);
  }
}