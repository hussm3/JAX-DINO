import { Platform } from './Platform';

export class Enemy {
  public x: number;
  public y: number;
  public width: number = 35;
  public height: number = 40;
  public velocityX: number;
  public velocityY: number = 0;
  public onGround: boolean = false;
  public type: 'jaguar' | 'hipster';
  private animFrame: number = 0;
  private direction: number = 1;

  constructor(x: number, y: number, type: 'jaguar' | 'alligator') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.velocityX = type === 'jaguar' ? 1.5 : 0.8;
  }

  public update(platforms: Platform[]) {
    // Move back and forth
    this.x += this.velocityX * this.direction;

    // Apply gravity
    this.velocityY += 0.8;
    this.y += this.velocityY;

    // Check platform collisions
    this.onGround = false;
    for (const platform of platforms) {
      if (this.checkCollision(platform)) {
        if (this.velocityY > 0 && this.y < platform.y) {
          this.y = platform.y - this.height;
          this.velocityY = 0;
          this.onGround = true;
        }
      }
    }

    // Change direction at platform edges or after traveling distance
    if (!this.onGround || Math.random() < 0.01) {
      this.direction *= -1;
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
    if (this.type === 'jaguar') {
      this.renderJaguar(ctx);
    } else {
      this.renderAlligator(ctx);
    }
  }

  private renderJaguar(ctx: CanvasRenderingContext2D) {
    // Determine facing direction based on movement
    const facingRight = this.direction > 0;
    
    // Jaguar body (sleek feline shape)
    ctx.fillStyle = '#F59E0B'; // Golden yellow base
    if (facingRight) {
      // Body facing right
      ctx.fillRect(this.x + 5, this.y + 15, 25, 20);
      // Chest
      ctx.fillRect(this.x + 25, this.y + 18, 8, 15);
    } else {
      // Body facing left
      ctx.fillRect(this.x + 5, this.y + 15, 25, 20);
      // Chest
      ctx.fillRect(this.x + 2, this.y + 18, 8, 15);
    }
    
    // Jaguar rosette spots (characteristic pattern)
    ctx.fillStyle = '#000000';
    // Body spots
    this.drawRosette(ctx, this.x + 8, this.y + 18, 3);
    this.drawRosette(ctx, this.x + 15, this.y + 22, 2);
    this.drawRosette(ctx, this.x + 22, this.y + 20, 3);
    this.drawRosette(ctx, this.x + 12, this.y + 28, 2);
    this.drawRosette(ctx, this.x + 20, this.y + 30, 2);
    
    // Head (feline profile)
    ctx.fillStyle = '#F59E0B';
    if (facingRight) {
      // Head facing right
      ctx.fillRect(this.x + 25, this.y + 5, 15, 12);
      // Snout
      ctx.fillRect(this.x + 35, this.y + 10, 6, 6);
      // Forehead
      ctx.fillRect(this.x + 28, this.y + 2, 10, 8);
    } else {
      // Head facing left
      ctx.fillRect(this.x - 5, this.y + 5, 15, 12);
      // Snout
      ctx.fillRect(this.x - 6, this.y + 10, 6, 6);
      // Forehead
      ctx.fillRect(this.x - 3, this.y + 2, 10, 8);
    }
    
    // Eyes (cat-like)
    ctx.fillStyle = '#FFFFFF';
    if (facingRight) {
      ctx.fillRect(this.x + 32, this.y + 7, 4, 3);
    } else {
      ctx.fillRect(this.x - 1, this.y + 7, 4, 3);
    }
    
    ctx.fillStyle = '#000000';
    if (facingRight) {
      // Cat pupil (vertical slit)
      ctx.fillRect(this.x + 34, this.y + 8, 1, 2);
    } else {
      ctx.fillRect(this.x + 1, this.y + 8, 1, 2);
    }
    
    // Ears (pointed cat ears)
    ctx.fillStyle = '#F59E0B';
    if (facingRight) {
      // Right-facing ears
      ctx.beginPath();
      ctx.moveTo(this.x + 30, this.y + 2);
      ctx.lineTo(this.x + 28, this.y - 2);
      ctx.lineTo(this.x + 32, this.y + 1);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(this.x + 35, this.y + 3);
      ctx.lineTo(this.x + 33, this.y - 1);
      ctx.lineTo(this.x + 37, this.y + 2);
      ctx.fill();
    } else {
      // Left-facing ears
      ctx.beginPath();
      ctx.moveTo(this.x + 5, this.y + 2);
      ctx.lineTo(this.x + 7, this.y - 2);
      ctx.lineTo(this.x + 3, this.y + 1);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + 3);
      ctx.lineTo(this.x + 2, this.y - 1);
      ctx.lineTo(this.x - 2, this.y + 2);
      ctx.fill();
    }
    
    // Legs (four cat legs)
    ctx.fillStyle = '#F59E0B';
    const legAnimation = Math.sin(this.animFrame * 0.15) * 1;
    
    // Front legs
    ctx.fillRect(this.x + 22, this.y + 32, 3, 8 + legAnimation);
    ctx.fillRect(this.x + 27, this.y + 32, 3, 8 - legAnimation);
    
    // Back legs (slightly thicker)
    ctx.fillRect(this.x + 8, this.y + 32, 4, 8 - legAnimation);
    ctx.fillRect(this.x + 14, this.y + 32, 4, 8 + legAnimation);
    
    // Paws
    ctx.fillStyle = '#E45E07';
    ctx.fillRect(this.x + 21, this.y + 38 + legAnimation, 5, 2);
    ctx.fillRect(this.x + 26, this.y + 38 - legAnimation, 5, 2);
    ctx.fillRect(this.x + 7, this.y + 38 - legAnimation, 6, 2);
    ctx.fillRect(this.x + 13, this.y + 38 + legAnimation, 6, 2);
    
    // Tail (long cat tail with curve)
    ctx.fillStyle = '#F59E0B';
    const tailCurve = Math.sin(this.animFrame * 0.1) * 3;
    if (facingRight) {
      ctx.fillRect(this.x - 8, this.y + 20 + tailCurve, 15, 4);
      ctx.fillRect(this.x - 15, this.y + 18 + tailCurve * 0.7, 10, 3);
      // Tail tip
      ctx.fillStyle = '#000000';
      ctx.fillRect(this.x - 17, this.y + 18 + tailCurve * 0.7, 3, 3);
    } else {
      ctx.fillRect(this.x + 28, this.y + 20 + tailCurve, 15, 4);
      ctx.fillRect(this.x + 40, this.y + 18 + tailCurve * 0.7, 10, 3);
      // Tail tip
      ctx.fillStyle = '#000000';
      ctx.fillRect(this.x + 49, this.y + 18 + tailCurve * 0.7, 3, 3);
    }
    
    // Nose
    ctx.fillStyle = '#000000';
    if (facingRight) {
      ctx.fillRect(this.x + 39, this.y + 12, 2, 1);
    } else {
      ctx.fillRect(this.x - 6, this.y + 12, 2, 1);
    }
  }
  
  private drawRosette(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    // Draw jaguar rosette pattern (ring of spots)
    ctx.fillStyle = '#000000';
    const spots = [
      {dx: 0, dy: -size},
      {dx: size, dy: 0},
      {dx: 0, dy: size},
      {dx: -size, dy: 0},
      {dx: size * 0.7, dy: -size * 0.7},
      {dx: size * 0.7, dy: size * 0.7},
      {dx: -size * 0.7, dy: size * 0.7},
      {dx: -size * 0.7, dy: -size * 0.7}
    ];
    
    spots.forEach(spot => {
      ctx.fillRect(x + spot.dx, y + spot.dy, 1, 1);
    });
  }

  private renderAlligator(ctx: CanvasRenderingContext2D) {
    // Determine facing direction
    const facingRight = this.direction > 0;
    
    // Alligator body (long reptilian body)
    ctx.fillStyle = '#22543D'; // Dark green base
    ctx.fillRect(this.x + 5, this.y + 20, 25, 15);
    
    // Belly (lighter green)
    ctx.fillStyle = '#38A169';
    ctx.fillRect(this.x + 7, this.y + 28, 21, 7);
    
    // Head and snout (elongated alligator head)
    ctx.fillStyle = '#22543D';
    if (facingRight) {
      // Head facing right
      ctx.fillRect(this.x + 25, this.y + 10, 12, 12);
      // Long snout
      ctx.fillRect(this.x + 35, this.y + 14, 10, 6);
      // Upper jaw
      ctx.fillRect(this.x + 33, this.y + 12, 12, 4);
    } else {
      // Head facing left
      ctx.fillRect(this.x - 2, this.y + 10, 12, 12);
      // Long snout
      ctx.fillRect(this.x - 10, this.y + 14, 10, 6);
      // Upper jaw
      ctx.fillRect(this.x - 10, this.y + 12, 12, 4);
    }
    
    // Alligator scales/ridges along back
    ctx.fillStyle = '#1A202C';
    for (let i = 0; i < 5; i++) {
      const scaleX = this.x + 8 + (i * 4);
      ctx.fillRect(scaleX, this.y + 18, 3, 2);
      ctx.fillRect(scaleX + 1, this.y + 16, 1, 2);
    }
    
    // Eyes (on top of head like real alligators)
    ctx.fillStyle = '#F59E0B'; // Yellow eyes
    if (facingRight) {
      ctx.fillRect(this.x + 30, this.y + 8, 4, 3);
      ctx.fillRect(this.x + 26, this.y + 9, 4, 3);
    } else {
      ctx.fillRect(this.x + 1, this.y + 8, 4, 3);
      ctx.fillRect(this.x + 5, this.y + 9, 4, 3);
    }
    
    // Eye pupils
    ctx.fillStyle = '#000000';
    if (facingRight) {
      ctx.fillRect(this.x + 32, this.y + 9, 1, 1);
      ctx.fillRect(this.x + 28, this.y + 10, 1, 1);
    } else {
      ctx.fillRect(this.x + 2, this.y + 9, 1, 1);
      ctx.fillRect(this.x + 6, this.y + 10, 1, 1);
    }
    
    // Nostrils
    ctx.fillStyle = '#000000';
    if (facingRight) {
      ctx.fillRect(this.x + 42, this.y + 16, 1, 1);
      ctx.fillRect(this.x + 44, this.y + 16, 1, 1);
    } else {
      ctx.fillRect(this.x - 9, this.y + 16, 1, 1);
      ctx.fillRect(this.x - 7, this.y + 16, 1, 1);
    }
    
    // Teeth (menacing alligator teeth)
    ctx.fillStyle = '#FFFFFF';
    if (facingRight) {
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(this.x + 36 + (i * 2), this.y + 18, 1, 3);
        ctx.fillRect(this.x + 37 + (i * 2), this.y + 15, 1, 2);
      }
    } else {
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(this.x - 8 + (i * 2), this.y + 18, 1, 3);
        ctx.fillRect(this.x - 7 + (i * 2), this.y + 15, 1, 2);
      }
    }
    
    // Four legs (short alligator legs)
    ctx.fillStyle = '#22543D';
    const legAnimation = Math.sin(this.animFrame * 0.08) * 0.5; // Slower movement
    
    // Front legs
    ctx.fillRect(this.x + 22, this.y + 32, 3, 6 + legAnimation);
    ctx.fillRect(this.x + 27, this.y + 32, 3, 6 - legAnimation);
    
    // Back legs (slightly behind)
    ctx.fillRect(this.x + 8, this.y + 32, 3, 6 - legAnimation);
    ctx.fillRect(this.x + 13, this.y + 32, 3, 6 + legAnimation);
    
    // Clawed feet
    ctx.fillStyle = '#1A202C';
    ctx.fillRect(this.x + 21, this.y + 36 + legAnimation, 5, 2);
    ctx.fillRect(this.x + 26, this.y + 36 - legAnimation, 5, 2);
    ctx.fillRect(this.x + 7, this.y + 36 - legAnimation, 5, 2);
    ctx.fillRect(this.x + 12, this.y + 36 + legAnimation, 5, 2);
    
    // Claws
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(this.x + 22 + i, this.y + 35 + legAnimation, 1, 2);
      ctx.fillRect(this.x + 27 + i, this.y + 35 - legAnimation, 1, 2);
      ctx.fillRect(this.x + 8 + i, this.y + 35 - legAnimation, 1, 2);
      ctx.fillRect(this.x + 13 + i, this.y + 35 + legAnimation, 1, 2);
    }
    
    // Long powerful tail
    ctx.fillStyle = '#22543D';
    const tailSway = Math.sin(this.animFrame * 0.05) * 2;
    
    if (facingRight) {
      // Tail segments getting smaller
      ctx.fillRect(this.x - 12, this.y + 22 + tailSway, 20, 8);
      ctx.fillRect(this.x - 22, this.y + 24 + tailSway * 0.7, 12, 6);
      ctx.fillRect(this.x - 30, this.y + 25 + tailSway * 0.5, 8, 4);
      ctx.fillRect(this.x - 35, this.y + 26 + tailSway * 0.3, 5, 3);
    } else {
      // Tail segments getting smaller
      ctx.fillRect(this.x + 27, this.y + 22 + tailSway, 20, 8);
      ctx.fillRect(this.x + 45, this.y + 24 + tailSway * 0.7, 12, 6);
      ctx.fillRect(this.x + 57, this.y + 25 + tailSway * 0.5, 8, 4);
      ctx.fillRect(this.x + 65, this.y + 26 + tailSway * 0.3, 5, 3);
    }
    
    // Tail ridges
    ctx.fillStyle = '#1A202C';
    if (facingRight) {
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(this.x - 10 + (i * 5), this.y + 20 + tailSway, 2, 1);
      }
    } else {
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(this.x + 30 + (i * 5), this.y + 20 + tailSway, 2, 1);
      }
    }
  }
}