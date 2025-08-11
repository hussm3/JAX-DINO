import React, { useEffect, useRef, useState } from 'react';
import Game from './game/Game';
import { LevelSelector } from './components/LevelSelector';
import { GameState, GameStateManager } from './game/GameState';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [gameState, setGameState] = useState<GameState>(() => GameStateManager.loadGameState());
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(gameState.currentLevel);

  useEffect(() => {
    if (canvasRef.current) {
      gameRef.current = new Game(
        canvasRef.current, 
        currentLevel,
        (nextLevel: number) => {
          setCurrentLevel(nextLevel);
          GameStateManager.setCurrentLevel(nextLevel);
          setGameState(GameStateManager.loadGameState());
        },
        (newState: GameState) => {
          setGameState(newState);
        },
        handleRestart
      );
      gameRef.current.start();
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.stop();
      }
    };
  }, [currentLevel]);

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
    GameStateManager.setCurrentLevel(level);
    setShowLevelSelector(false);
  };

  const handleRestart = () => {
    // Stop current game
    if (gameRef.current) {
      gameRef.current.stop();
    }
    
    // Restart the same level
    if (canvasRef.current) {
      gameRef.current = new Game(
        canvasRef.current, 
        currentLevel,
        (nextLevel: number) => {
          setCurrentLevel(nextLevel);
          GameStateManager.setCurrentLevel(nextLevel);
          setGameState(GameStateManager.loadGameState());
        },
        (newState: GameState) => {
          setGameState(newState);
        },
        handleRestart
      );
      gameRef.current.start();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-500 flex flex-col items-center justify-center">
      <div className="text-center mb-4">
        <p className="text-white drop-shadow text-lg">
          Use ARROW KEYS to move and SPACE to jump
        </p>
      </div>
      
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        className="border-4 border-orange-400 rounded-lg shadow-2xl bg-gradient-to-b from-sky-200 to-green-200"
      />
      
      <div className="mt-4 flex items-center gap-4">
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, i) => {
            const level = i + 1;
            const isUnlocked = gameState.unlockedLevels.includes(level);
            const isCurrent = level === currentLevel;
            
            return (
              <button
                key={level}
                onClick={() => isUnlocked ? handleLevelSelect(level) : null}
                disabled={!isUnlocked}
                className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm
                  transition-all duration-200
                  ${isUnlocked 
                    ? 'border-orange-400 bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer' 
                    : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                  ${isCurrent ? 'ring-2 ring-orange-500 bg-orange-500 text-white' : ''}
                `}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>
      
      {showLevelSelector && (
        <LevelSelector
          unlockedLevels={gameState.unlockedLevels}
          currentLevel={currentLevel}
          onLevelSelect={handleLevelSelect}
          onClose={() => setShowLevelSelector(false)}
        />
      )}
    </div>
  );
}

export default App;