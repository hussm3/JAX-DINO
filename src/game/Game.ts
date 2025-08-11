import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { Coin } from './entities/Coin';
import { Platform } from './entities/Platform';
import { Camera } from './Camera';
import { InputHandler } from './InputHandler';
import { GameState, GameStateManager } from './GameState';
import { LEVELS, LevelData, createPlatformsFromData, createEnemiesFromData, createCoinsFromData } from './levels/LevelConfig';

export default class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private enemies: Enemy[] = [];
  private coins: Coin[] = [];
  private platforms: Platform[] = [];
  private camera: Camera;
  private inputHandler: InputHandler;
  private animationId: number = 0;
  private score: number = 0;
  private gameWon: boolean = false;
  private gameOver: boolean = false;
  private gameState: GameState;
  private currentLevelData: LevelData;
  private onLevelComplete?: (nextLevel: number) => void;
  private onGameStateChange?: (state: GameState) => void;
  private onRestart?: () => void;

  constructor(canvas: HTMLCanvasElement, level: number = 1, onLevelComplete?: (nextLevel: number) => void, onGameStateChange?: (state: GameState) => void, onRestart?: () => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.camera = new Camera(0, 0, canvas.width, canvas.height);
    this.inputHandler = new InputHandler();
    this.onLevelComplete = onLevelComplete;
    this.onGameStateChange = onGameStateChange;
    this.onRestart = onRestart;
    
    this.gameState = GameStateManager.loadGameState();
    this.currentLevelData = LEVELS.find(l => l.id === level) || LEVELS[0];
    this.player = new Player(this.currentLevelData.playerStart.x, this.currentLevelData.playerStart.y);
    
    this.setupLevel();
  }

  private setupLevel() {
    this.platforms = createPlatformsFromData(this.currentLevelData.platforms);
    this.enemies = createEnemiesFromData(this.currentLevelData.enemies);
    this.coins = createCoinsFromData(this.currentLevelData.coins);
    this.score = this.gameState.score;
  }

  public start() {
    this.gameLoop();
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private gameLoop = () => {
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  private update() {
    if (this.gameWon || this.gameOver) return;

    // Check for restart key
    if ((this.gameOver || this.gameWon) && this.inputHandler.isPressed('KeyR')) {
      if (this.onRestart) {
        this.onRestart();
      }
      return;
    }

    this.player.update(this.inputHandler, this.platforms);
    
    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.update(this.platforms);
    });

    // Check coin collection
    this.coins = this.coins.filter(coin => {
      if (this.checkCollision(this.player, coin)) {
        this.score += 100;
        return false;
      }
      return true;
    });

    // Check enemy collisions
    this.enemies = this.enemies.filter(enemy => {
      if (this.checkCollision(this.player, enemy)) {
        if (this.player.velocityY > 0 && this.player.y < enemy.y) {
          // Player jumped on enemy
          this.player.velocityY = -15; // Bounce
          this.score += 200;
          return false; // Remove enemy
        } else {
          // Player hit enemy from side - game over
          this.gameOver = true;
          return true;
        }
      }
      return true;
    });

    // Check win condition
    if (this.player.x > this.currentLevelData.winCondition.x && this.player.y < this.currentLevelData.winCondition.y) {
      this.gameWon = true;
      
      // Update game state
      this.gameState.score = this.score;
      const nextLevel = this.currentLevelData.id + 1;
      if (nextLevel <= LEVELS.length && !this.gameState.unlockedLevels.includes(nextLevel)) {
        GameStateManager.unlockLevel(nextLevel);
        this.gameState = GameStateManager.loadGameState();
      }
      GameStateManager.saveGameState(this.gameState);
      
      if (this.onGameStateChange) {
        this.onGameStateChange(this.gameState);
      }
      
      // Trigger level complete callback after a short delay
      if (this.onLevelComplete && nextLevel <= LEVELS.length) {
        setTimeout(() => {
          this.onLevelComplete!(nextLevel);
        }, 2000);
      }
    }

    // Check if player fell off the map
    if (this.player.y > 700) {
      this.gameOver = true;
    }

    // Update camera to follow player
    this.camera.x = this.player.x - this.canvas.width / 2;
    this.camera.y = this.player.y - this.canvas.height / 2;

    // Keep camera bounds reasonable
    this.camera.x = Math.max(0, this.camera.x);
    this.camera.y = Math.max(-200, Math.min(0, this.camera.y));
  }

  private checkCollision(rect1: any, rect2: any): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  private render() {
    // Draw background based on level
    this.drawBackground();

    // Save context for camera transform
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // Draw platforms
    this.platforms.forEach(platform => platform.render(this.ctx));

    // Draw coins
    this.coins.forEach(coin => coin.render(this.ctx));

    // Draw enemies
    this.enemies.forEach(enemy => enemy.render(this.ctx));

    // Draw player
    this.player.render(this.ctx);

    // Draw level goal
    this.drawLevelGoal();

    // Restore context
    this.ctx.restore();

    // Draw UI
    this.drawUI();
  }

  private drawLevelGoal() {
    const goalX = this.currentLevelData.winCondition.x;
    const goalY = this.currentLevelData.winCondition.y - 200;
    
    this.ctx.fillStyle = '#4A5568';
    this.ctx.fillRect(goalX, goalY, 100, 200);
    this.ctx.fillStyle = '#2D3748';
    this.ctx.fillRect(goalX + 10, goalY + 10, 80, 180);
    
    // Goal sign
    this.ctx.fillStyle = '#F7FAFC';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GOAL', goalX + 50, goalY + 30);
    this.ctx.fillText(`LV${this.currentLevelData.id}`, goalX + 50, goalY + 50);
    this.ctx.textAlign = 'left'; // Reset text alignment
  }

  private drawBackground() {
    switch (this.currentLevelData.background) {
      case 'jungle':
        this.drawJungleBackground();
        break;
      case 'swamp':
        this.drawSwampBackground();
        break;
      case 'mountain':
        this.drawMountainBackground();
        break;
      default:
        this.drawJungleBackground();
    }
  }

  private drawJungleBackground() {
    // Jungle sky
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawSun(150, 100);
    this.drawClouds();
    this.drawGround('#22C55E');
    this.drawPalmTrees();
  }

  private drawSwampBackground() {
    // Swamp sky (darker, more ominous)
    this.ctx.fillStyle = '#6B7280';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawSun(150, 120, '#D1D5DB'); // Pale sun
    this.drawClouds('#9CA3AF'); // Gray clouds
    this.drawGround('#065F46'); // Dark swamp green
    this.drawSwampTrees();
  }

  private drawMountainBackground() {
    // Mountain sky (crisp blue)
    this.ctx.fillStyle = '#3B82F6';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawSun(150, 80);
    this.drawClouds();
    this.drawGround('#8B5A2B'); // Rocky ground
    this.drawMountainPeaks();
  }

  private drawSun(x: number, y: number, color: string = '#FFD700') {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 40, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawClouds(color: string = '#FFFFFF') {
    this.ctx.fillStyle = color;
    this.drawSimpleCloud(300, 80);
    this.drawSimpleCloud(600, 120);
    this.drawSimpleCloud(900, 90);
  }

  private drawSimpleCloud(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 25, 0, Math.PI * 2);
    this.ctx.arc(x + 20, y, 30, 0, Math.PI * 2);
    this.ctx.arc(x + 40, y, 25, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawGround(color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
  }

  private drawPalmTrees() {
    this.ctx.save();
    const parallaxX = -this.camera.x * 0.3;
    this.ctx.translate(parallaxX, 0);
    
    this.drawPalmTree(200, this.canvas.height - 100);
    this.drawPalmTree(500, this.canvas.height - 100);
    this.drawPalmTree(800, this.canvas.height - 100);
    this.drawPalmTree(1200, this.canvas.height - 100);
    
    this.ctx.restore();
  }

  private drawSwampTrees() {
    this.ctx.save();
    const parallaxX = -this.camera.x * 0.3;
    this.ctx.translate(parallaxX, 0);
    
    // Dead/bare trees for swamp
    this.drawDeadTree(250, this.canvas.height - 100);
    this.drawDeadTree(550, this.canvas.height - 100);
    this.drawDeadTree(850, this.canvas.height - 100);
    
    this.ctx.restore();
  }

  private drawMountainPeaks() {
    this.ctx.save();
    const parallaxX = -this.camera.x * 0.2;
    this.ctx.translate(parallaxX, 0);
    
    // Mountain silhouettes
    this.ctx.fillStyle = '#6B7280';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height - 200);
    this.ctx.lineTo(200, this.canvas.height - 350);
    this.ctx.lineTo(400, this.canvas.height - 280);
    this.ctx.lineTo(600, this.canvas.height - 400);
    this.ctx.lineTo(800, this.canvas.height - 320);
    this.ctx.lineTo(1000, this.canvas.height - 380);
    this.ctx.lineTo(1200, this.canvas.height - 200);
    this.ctx.lineTo(1200, this.canvas.height);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  private drawPalmTree(x: number, y: number) {
    // Palm tree trunk
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(x, y - 80, 8, 80);
    
    // Palm fronds
    this.ctx.fillStyle = '#228B22';
    this.ctx.beginPath();
    // Left fronds
    this.ctx.moveTo(x + 4, y - 80);
    this.ctx.lineTo(x - 20, y - 100);
    this.ctx.lineTo(x - 30, y - 90);
    this.ctx.lineTo(x + 4, y - 80);
    // Right fronds
    this.ctx.moveTo(x + 4, y - 80);
    this.ctx.lineTo(x + 28, y - 100);
    this.ctx.lineTo(x + 38, y - 90);
    this.ctx.lineTo(x + 4, y - 80);
    // Top fronds
    this.ctx.moveTo(x + 4, y - 80);
    this.ctx.lineTo(x - 5, y - 110);
    this.ctx.lineTo(x + 5, y - 115);
    this.ctx.lineTo(x + 4, y - 80);
    this.ctx.moveTo(x + 4, y - 80);
    this.ctx.lineTo(x + 13, y - 110);
    this.ctx.lineTo(x + 3, y - 115);
    this.ctx.lineTo(x + 4, y - 80);
    this.ctx.fill();
  }

  private drawDeadTree(x: number, y: number) {
    // Dead tree trunk
    this.ctx.fillStyle = '#4A5568';
    this.ctx.fillRect(x, y - 60, 6, 60);
    
    // Bare branches
    this.ctx.strokeStyle = '#4A5568';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x + 3, y - 40);
    this.ctx.lineTo(x - 10, y - 50);
    this.ctx.moveTo(x + 3, y - 40);
    this.ctx.lineTo(x + 16, y - 55);
    this.ctx.moveTo(x + 3, y - 20);
    this.ctx.lineTo(x - 8, y - 25);
    this.ctx.moveTo(x + 3, y - 20);
    this.ctx.lineTo(x + 14, y - 30);
    this.ctx.stroke();
  }

  private drawUI() {
    // Level indicator
    this.ctx.fillStyle = '#1A202C';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.fillText(`Level ${this.currentLevelData.id}: ${this.currentLevelData.name}`, 20, 30);
    
    // Score
    this.ctx.fillStyle = '#1A202C';
    this.ctx.font = 'bold 18px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 20, 55);

    // Game over/win screens
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#E53E3E';
      this.ctx.font = 'bold 48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 50);
      
      this.ctx.fillStyle = '#F7FAFC';
      this.ctx.font = '24px Arial';
      this.ctx.fillText('Press R to restart', this.canvas.width / 2, this.canvas.height / 2 + 20);
      this.ctx.textAlign = 'left';
    }

    if (this.gameWon) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#F7FAFC';
      this.ctx.font = 'bold 48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`Level ${this.currentLevelData.id} Complete!`, this.canvas.width / 2, this.canvas.height / 2 - 50);
      this.ctx.font = '24px Arial';
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
      
      const nextLevel = this.currentLevelData.id + 1;
      if (nextLevel <= LEVELS.length) {
        this.ctx.fillText(`Loading Level ${nextLevel}...`, this.canvas.width / 2, this.canvas.height / 2 + 40);
      } else {
        this.ctx.fillText('All levels complete!', this.canvas.width / 2, this.canvas.height / 2 + 40);
      }
      this.ctx.textAlign = 'left';
    }
  }
}