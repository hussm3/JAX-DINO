import React from 'react';
import { Lock, Star } from 'lucide-react';

interface LevelSelectorProps {
  unlockedLevels: number[];
  currentLevel: number;
  onLevelSelect: (level: number) => void;
  onClose: () => void;
}

const TOTAL_LEVELS = 3;

export function LevelSelector({ unlockedLevels, currentLevel, onLevelSelect, onClose }: LevelSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Level</h2>
          <p className="text-gray-600">Choose a level to play</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
            const level = i + 1;
            const isUnlocked = unlockedLevels.includes(level);
            const isCurrent = level === currentLevel;
            
            return (
              <button
                key={level}
                onClick={() => isUnlocked ? onLevelSelect(level) : null}
                disabled={!isUnlocked}
                className={`
                  relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center
                  transition-all duration-200 text-lg font-bold
                  ${isUnlocked 
                    ? 'border-orange-400 bg-orange-50 hover:bg-orange-100 cursor-pointer' 
                    : 'border-gray-300 bg-gray-100 cursor-not-allowed'
                  }
                  ${isCurrent ? 'ring-2 ring-orange-500' : ''}
                `}
              >
                {isUnlocked ? (
                  <>
                    <Star className="w-6 h-6 text-orange-500 mb-1" />
                    <span className="text-gray-800">{level}</span>
                    {isCurrent && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-gray-400">{level}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onLevelSelect(currentLevel)}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Play Current Level
          </button>
        </div>
      </div>
    </div>
  );
}