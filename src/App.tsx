import React, { useEffect, useRef } from 'react';
import Game from './game/Game';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      gameRef.current = new Game(canvasRef.current);
      gameRef.current.start();
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
          Use ARROW KEYS to move and SPACE to jump
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