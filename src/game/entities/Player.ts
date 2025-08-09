import { Platform } from './Platform';
import { InputHandler } from '../InputHandler';

export class Player {
  public x: number;
  public y: number;
  public width: number = 40;
  public height: number = 50;
  public velocityX: number = 0;
  public velocityY: number = 0;
  public onGround: boolean = false;
  public speed: number = 5;
  public jumpPower: number = 16;
  private animFrame: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public update(input: InputHandler, platforms: Platform[]) {
    // Handle input
    if (input.left) {
      this.velocityX = -this.speed;
    } else if (input.right) {
      this.velocityX = this.speed;
    } else {
      this.velocityX *= 0.8; // Friction
    }

    if (input.jump && this.onGround) {
      this.velocityY = -this.jumpPower;
      this.onGround = false;
    }

    // Apply gravity
    this.velocityY += 0.8;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check platform collisions
    this.onGround = false;
    for (const platform of platforms) {
      if (this.checkCollision(platform)) {
        // Top collision (landing on platform)
        if (this.velocityY > 0 && this.y < platform.y) {
          this.y = platform.y - this.height;
          this.velocityY = 0;
          this.onGround = true;
        }
        // Bottom collision
        else if (this.velocityY < 0 && this.y > platform.y) {
          this.y = platform.y + platform.height;
          this.velocityY = 0;
        }
        // Left collision
        else if (this.velocityX > 0 && this.x < platform.x) {
          this.x = platform.x - this.width;
          this.velocityX = 0;
        }
        // Right collision
        else if (this.velocityX < 0 && this.x > platform.x) {
          this.x = platform.x + platform.width;
          this.velocityX = 0;
        }
      }
    }

    this.animFrame++;
  }

  private checkCollision(platform: Platform): boolean {
    return this.x < platform.x + platform.width &&
           this.x + this.width > platform.x &&
           this.y < platform.y + platform.height &&
           this.y + this.height > platform.y;
  }

  public render(ctx: CanvasRenderingContext2D) {
    // Determine facing direction
    const facingRight = this.velocityX >= 0;
    
    // Draw Rex the T-Rex Dinosaur (side profile)
    ctx.fillStyle = '#F97316'; // Orange body
    ctx.fillRect(this.x, this.y + 10, this.width - 5, this.height - 15);
    
    // Head (large T-Rex head)
    ctx.fillStyle = '#EA580C'; // Darker orange
    if (facingRight) {
      // Head facing right
      ctx.fillRect(this.x + this.width - 15, this.y - 5, 25, 20);
      
      // Eyes facing right
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.x + this.width - 8, this.y - 2, 4, 4);
      ctx.fillStyle = '#000000';
      ctx.fillRect(this.x + this.width - 6, this.y, 2, 2);
      
      // Mouth/jaw
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(this.x + this.width + 5, this.y + 5, 8, 3);
      
      // Teeth
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(this.x + this.width + 6 + (i * 2), this.y + 3, 1, 3);
      }
    } else {
      // Head facing left
      ctx.fillRect(this.x - 10, this.y - 5, 25, 20);
      
      // Eyes facing left
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.x + 4, this.y - 2, 4, 4);
      ctx.fillStyle = '#000000';
      ctx.fillRect(this.x + 4, this.y, 2, 2);
      
      // Mouth/jaw
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(this.x - 13, this.y + 5, 8, 3);
      
      // Teeth
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(this.x - 12 + (i * 2), this.y + 3, 1, 3);
      }
    }
    
    // Spikes along back
    ctx.fillStyle = '#C2410C'; // Dark orange spikes
    for (let i = 0; i < 3; i++) {
      const spikeX = this.x + 8 + (i * 8);
      ctx.beginPath();
      ctx.moveTo(spikeX, this.y + 15);
      ctx.lineTo(spikeX + 3, this.y + 5);
      ctx.lineTo(spikeX + 6, this.y + 15);
      ctx.fill();
    }
    
    // Legs (powerful T-Rex legs with animation)
    ctx.fillStyle = '#EA580C'; // Darker orange
    const legOffset = this.onGround ? Math.sin(this.animFrame * 0.2) * 1 : 0;
    
    // Thick, powerful legs
    ctx.fillRect(this.x + 8, this.y + this.height - 5, 6, 12 + legOffset);
    ctx.fillRect(this.x + 22, this.y + this.height - 5, 6, 12 - legOffset);
    
    // Feet
    ctx.fillRect(this.x + 6, this.y + this.height + 7 + legOffset, 10, 4);
    ctx.fillRect(this.x + 20, this.y + this.height + 7 - legOffset, 10, 4);
    
    // Claws
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(this.x + 7 + (i * 2), this.y + this.height + 6 + legOffset, 1, 2);
      ctx.fillRect(this.x + 21 + (i * 2), this.y + this.height + 6 - legOffset, 1, 2);
    }
    
    // Tail (long T-Rex tail with sway)
    ctx.fillStyle = '#F97316'; // Orange tail
    const tailSway = Math.sin(this.animFrame * 0.1) * 2;
    
    // Tail segments for more realistic look
    if (facingRight) {
      ctx.fillRect(this.x - 15, this.y + 25 + tailSway, 18, 6);
      ctx.fillRect(this.x - 25, this.y + 27 + tailSway * 0.7, 12, 4);
      ctx.fillRect(this.x - 32, this.y + 28 + tailSway * 0.5, 8, 3);
    } else {
      ctx.fillRect(this.x + 32, this.y + 25 + tailSway, 18, 6);
      ctx.fillRect(this.x + 38, this.y + 27 + tailSway * 0.7, 12, 4);
      ctx.fillRect(this.x + 44, this.y + 28 + tailSway * 0.5, 8, 3);
    }
    
    // Tiny arms (classic T-Rex feature)
    ctx.fillStyle = '#EA580C';
    if (facingRight) {
      ctx.fillRect(this.x + this.width - 20, this.y + 15, 8, 3);
      ctx.fillRect(this.x + this.width - 15, this.y + 16, 3, 5);
    } else {
      ctx.fillRect(this.x + 12, this.y + 15, 8, 3);
      ctx.fillRect(this.x + 12, this.y + 16, 3, 5);
    }
  }
}