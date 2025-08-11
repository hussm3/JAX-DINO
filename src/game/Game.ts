import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { Coin } from './entities/Coin';
import { Platform } from './entities/Platform';
import { Camera } from './Camera';
import { InputHandler } from './InputHandler';
import { LevelManager } from './LevelManager';

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
  private levelManager: LevelManager;
  private showLevelSelect: boolean = false;
  private levelCompleteTimer: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.camera = new Camera(0, 0, canvas.width, canvas.height);
    this.inputHandler = new InputHandler();
    this.levelManager = new LevelManager();
    
    this.loadCurrentLevel();
  }

  private loadCurrentLevel() {
    const levelData = this.levelManager.getCurrentLevel();
    
    // Reset game state
    this.gameWon = false;
    this.gameOver = false;
    this.score = 0;
    this.levelCompleteTimer = 0;
    
    // Create player at starting position
    this.player = new Player(levelData.playerStart.x, levelData.playerStart.y);
    
    // Create platforms
    this.platforms = levelData.platforms.map(p => 
      new Platform(p.x, p.y, p.width, p.height)
    );
    
    // Create enemies
    this.enemies = levelData.enemies.map(e => 
      new Enemy(e.x, e.y, e.type)
    );
    
    // Create coins
    this.coins = levelData.coins.map(c => 
      new Coin(c.x, c.y)
    );
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
    if (this.showLevelSelect) {
      this.handleLevelSelectInput();
      return;
    }

    if (this.gameWon) {
      this.levelCompleteTimer++;
      if (this.levelCompleteTimer > 180) { // 3 seconds at 60fps
        this.nextLevel();
      }
      return;
    }
    
    if (this.gameOver) return;

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
    const levelData = this.levelManager.getCurrentLevel();
    if (this.player.x > levelData.winCondition.x && this.player.y < levelData.winCondition.y) {
      this.gameWon = true;
      this.levelManager.completeLevel(this.levelManager.getCurrentLevelNumber());
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

  private handleLevelSelectInput() {
    // Handle mouse clicks for level selection
    // This will be handled by the canvas click event
  }

  private nextLevel() {
    const currentLevel = this.levelManager.getCurrentLevelNumber();
    if (currentLevel < this.levelManager.getTotalLevels()) {
      this.levelManager.setCurrentLevel(currentLevel + 1);
      this.loadCurrentLevel();
    } else {
      // All levels completed - show level select
      this.showLevelSelect = true;
    }
  }

  public selectLevel(levelId: number) {
    if (this.levelManager.isLevelUnlocked(levelId)) {
      this.levelManager.setCurrentLevel(levelId);
      this.loadCurrentLevel();
      this.showLevelSelect = false;
    }
  }

  public toggleLevelSelect() {
    this.showLevelSelect = !this.showLevelSelect;
  }

  public isShowingLevelSelect(): boolean {
    return this.showLevelSelect;
  }

  public getLevelManager(): LevelManager {
    return this.levelManager;
  }

  private checkCollision(rect1: any, rect2: any): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  private render() {
    if (this.showLevelSelect) {
      this.renderLevelSelect();
      return;
    }

    // Draw Jacksonville skyline background
    this.drawJacksonvilleSkyline();

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

  private renderLevelSelect() {
    // Dark background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Title
    this.ctx.fillStyle = '#F7FAFC';
    this.ctx.font = 'bold 36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Select Level', this.canvas.width / 2, 80);
    
    // Level circles
    const levels = this.levelManager.getAllLevels();
    const startX = this.canvas.width / 2 - (levels.length * 60) / 2;
    const y = this.canvas.height / 2;
    
    levels.forEach((level, index) => {
      const x = startX + (index * 80);
      
      // Circle background
      this.ctx.beginPath();
      this.ctx.arc(x, y, 25, 0, Math.PI * 2);
      
      if (level.completed) {
        this.ctx.fillStyle = '#10B981'; // Green for completed
      } else if (level.unlocked) {
        this.ctx.fillStyle = '#3B82F6'; // Blue for unlocked
      } else {
        this.ctx.fillStyle = '#6B7280'; // Gray for locked
      }
      this.ctx.fill();
      
      // Level number
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(level.id.toString(), x, y + 6);
      
      // Level name
      this.ctx.fillStyle = level.unlocked ? '#F7FAFC' : '#9CA3AF';
      this.ctx.font = '14px Arial';
      this.ctx.fillText(level.name, x, y + 45);
      
      // Completion checkmark
      if (level.completed) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('✓', x + 18, y - 15);
      }
    });
    
    // Instructions
    this.ctx.fillStyle = '#9CA3AF';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Click on a level to play it', this.canvas.width / 2, this.canvas.height - 100);
    this.ctx.fillText('Press ESC to return to current level', this.canvas.width / 2, this.canvas.height - 70);
    
    this.ctx.textAlign = 'left'; // Reset text alignment
  }

  private drawLevelGoal() {
    const levelData = this.levelManager.getCurrentLevel();
    this.ctx.fillStyle = '#4A5568';
    this.ctx.fillRect(levelData.winCondition.x, levelData.winCondition.y - 200, 100, 200);
    this.ctx.fillStyle = '#2D3748';
    this.ctx.fillRect(levelData.winCondition.x + 10, levelData.winCondition.y - 190, 80, 180);
    
    // Goal sign
    this.ctx.fillStyle = '#F7FAFC';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GOAL', levelData.winCondition.x + 50, levelData.winCondition.y - 170);
    this.ctx.textAlign = 'left'; // Reset text alignment
  }

  private drawJacksonvilleSkyline() {
    // Simple Florida sky
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Simple sun
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.arc(150, 100, 40, 0, Math.PI * 2);
    this.ctx.fill();

    // Simple clouds
    this.ctx.fillStyle = '#FFFFFF';
    this.drawSimpleCloud(300, 80);
    this.drawSimpleCloud(600, 120);
    this.drawSimpleCloud(900, 90);

    // Simple ground/grass
    this.ctx.fillStyle = '#22C55E';
    this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);

    // Simple palm trees (Florida touch)
    this.ctx.save();
    const parallaxX = -this.camera.x * 0.3;
    this.ctx.translate(parallaxX, 0);
    
    this.drawPalmTree(200, this.canvas.height - 100);
    this.drawPalmTree(500, this.canvas.height - 100);
    this.drawPalmTree(800, this.canvas.height - 100);
    this.drawPalmTree(1200, this.canvas.height - 100);
    
    this.ctx.restore();
  }

  private drawSimpleCloud(x: number, y: number) {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 25, 0, Math.PI * 2);
    this.ctx.arc(x + 20, y, 30, 0, Math.PI * 2);
    this.ctx.arc(x + 40, y, 25, 0, Math.PI * 2);
    this.ctx.fill();
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

  private lightenColor(color: string, percent: number): string {
    // Simple color lightening function
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  private drawUI() {
    // Score
    this.ctx.fillStyle = '#1A202C';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillText(`Level ${this.levelManager.getCurrentLevelNumber()}: ${this.levelManager.getCurrentLevel().name}`, 20, 30);
    this.ctx.fillText(`Score: ${this.score}`, 20, 60);

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
      this.ctx.fillText('Refresh to play again', this.canvas.width / 2, this.canvas.height / 2 + 20);
      this.ctx.textAlign = 'left';
    }

    if (this.gameWon) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#F7FAFC';
      this.ctx.font = 'bold 48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Level Complete!', this.canvas.width / 2, this.canvas.height / 2 - 50);
      this.ctx.font = '24px Arial';
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
      
      const currentLevel = this.levelManager.getCurrentLevelNumber();
      if (currentLevel < this.levelManager.getTotalLevels()) {
        this.ctx.fillText('Loading next level...', this.canvas.width / 2, this.canvas.height / 2 + 40);
      } else {
        this.ctx.fillText('All levels completed!', this.canvas.width / 2, this.canvas.height / 2 + 40);
      }
      this.ctx.textAlign = 'left';
    }
    
    // Level select circles at bottom
    if (!this.gameWon && !this.gameOver && !this.showLevelSelect) {
      this.drawLevelSelectCircles();
    }
  }
  
  private drawLevelSelectCircles() {
    const levels = this.levelManager.getAllLevels();
    const startX = this.canvas.width / 2 - (levels.length * 30) / 2;
    const y = this.canvas.height - 40;
    
    levels.forEach((level, index) => {
      const x = startX + (index * 40);
      
      // Circle background
      this.ctx.beginPath();
      this.ctx.arc(x, y, 15, 0, Math.PI * 2);
      
      if (level.completed) {
        this.ctx.fillStyle = '#10B981'; // Green for completed
      } else if (level.unlocked) {
        this.ctx.fillStyle = '#3B82F6'; // Blue for unlocked
      } else {
        this.ctx.fillStyle = '#374151'; // Dark gray for locked
      }
      this.ctx.fill();
      
      // Current level indicator
      if (level.id === this.levelManager.getCurrentLevelNumber()) {
        this.ctx.strokeStyle = '#F59E0B';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
      }
      
      // Level number
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(level.id.toString(), x, y + 4);
      
      // Completion checkmark
      if (level.completed) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.fillText('✓', x + 10, y - 8);
      }
    });
    
    this.ctx.textAlign = 'left'; // Reset text alignment
  }
}