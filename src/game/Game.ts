import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { Coin } from './entities/Coin';
import { Platform } from './entities/Platform';
import { Camera } from './Camera';
import { InputHandler } from './InputHandler';

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

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.camera = new Camera(0, 0, canvas.width, canvas.height);
    this.inputHandler = new InputHandler();
    this.player = new Player(100, 400);
    
    this.setupLevel();
  }

  private setupLevel() {
    // Ground platforms
    this.platforms = [
      new Platform(0, 550, 200, 50),
      new Platform(300, 500, 150, 20),
      new Platform(500, 450, 150, 20),
      new Platform(700, 400, 150, 20),
      new Platform(900, 350, 150, 20),
      new Platform(1100, 300, 150, 20),
      new Platform(1300, 400, 200, 20),
      new Platform(1600, 450, 150, 20),
      new Platform(1850, 500, 150, 20),
      new Platform(2100, 400, 300, 50), // Town center platform
      // Ground level
      new Platform(-100, 580, 2500, 50),
    ];

    // Enemies (Jaguars and Hipsters)
    this.enemies = [
      new Enemy(400, 470, 'jaguar'),
      new Enemy(600, 420, 'alligator'),
      new Enemy(1000, 320, 'jaguar'),
      new Enemy(1400, 370, 'alligator'),
      new Enemy(1700, 420, 'jaguar'),
    ];

    // Coins
    this.coins = [
      new Coin(350, 450),
      new Coin(550, 400),
      new Coin(750, 350),
      new Coin(950, 300),
      new Coin(1150, 250),
      new Coin(1350, 350),
      new Coin(1650, 400),
      new Coin(1900, 450),
      new Coin(2120, 350), // Left side of town center platform
      new Coin(2160, 350), // Left side of town center platform
    ];
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

    // Check win condition (reach town center)
    if (this.player.x > 2300 && this.player.y < 400) {
      this.gameWon = true;
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

    // Draw town center
    this.drawTownCenter();

    // Restore context
    this.ctx.restore();

    // Draw UI
    this.drawUI();
  }

  private drawTownCenter() {
    // Move town center to the right side of the platform
    this.ctx.fillStyle = '#4A5568';
    this.ctx.fillRect(2300, 200, 100, 200);
    this.ctx.fillStyle = '#2D3748';
    this.ctx.fillRect(2310, 210, 80, 180);
    
    // Town Center sign - centered at top
    this.ctx.fillStyle = '#F7FAFC';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('TOWN', 2350, 230);
    this.ctx.fillText('CENTER', 2350, 250);
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
    this.ctx.fillText(`Score: ${this.score}`, 20, 40);

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
      this.ctx.fillText('You made it to the Town Center!', this.canvas.width / 2, this.canvas.height / 2 - 50);
      this.ctx.font = '24px Arial';
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.fillText('Refresh to play again', this.canvas.width / 2, this.canvas.height / 2 + 40);
      this.ctx.textAlign = 'left';
    }
  }
}