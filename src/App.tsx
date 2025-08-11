import React, { useEffect, useRef } from 'react';
import Game from './game/Game';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      gameRef.current = new Game(canvasRef.current);
      gameRef.current.start();
      
      // Handle canvas clicks for level selection
      const handleCanvasClick = (e: MouseEvent) => {
        if (gameRef.current) {
          const rect = canvasRef.current!.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          if (gameRef.current.isShowingLevelSelect()) {
            // Handle level selection clicks
            const levels = gameRef.current.getLevelManager().getAllLevels();
            const startX = canvasRef.current!.width / 2 - (levels.length * 60) / 2;
            const circleY = canvasRef.current!.height / 2;
            
            levels.forEach((level, index) => {
              const circleX = startX + (index * 80);
              const distance = Math.sqrt((x - circleX) ** 2 + (y - circleY) ** 2);
              
              if (distance <= 25 && level.unlocked) {
                gameRef.current!.selectLevel(level.id);
              }
            });
          } else {
            // Handle bottom level select circles
            const levels = gameRef.current.getLevelManager().getAllLevels();
            const startX = canvasRef.current!.width / 2 - (levels.length * 30) / 2;
            const circleY = canvasRef.current!.height - 40;
            
            levels.forEach((level, index) => {
              const circleX = startX + (index * 40);
              const distance = Math.sqrt((x - circleX) ** 2 + (y - circleY) ** 2);
              
              if (distance <= 15 && level.unlocked) {
                gameRef.current!.selectLevel(level.id);
              }
            });
          }
        }
      };
      
      // Handle ESC key for level select
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.code === 'Escape' && gameRef.current) {
          gameRef.current.toggleLevelSelect();
        }
      };
      
      canvasRef.current.addEventListener('click', handleCanvasClick);
      window.addEventListener('keydown', handleKeyPress);
      
      return () => {
        canvasRef.current?.removeEventListener('click', handleCanvasClick);
        window.removeEventListener('keydown', handleKeyPress);
      };
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-500 flex flex-col items-center justify-center">
      <div className="text-center mb-4">
        <p className="text-white drop-shadow text-lg">
          Use ARROW KEYS to move, SPACE to jump, ESC for level select
        </p>
        <p className="text-white drop-shadow text-sm mt-1">
          Click level circles to switch levels
        </p>
      </div>
      
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        className="border-4 border-orange-400 rounded-lg shadow-2xl bg-gradient-to-b from-sky-200 to-green-200"
      />
      
    </div>
  );
}

export default App;