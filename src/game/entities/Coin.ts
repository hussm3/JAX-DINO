export class Coin {
  public x: number;
  public y: number;
  public width: number = 16;
  public height: number = 24;
  private animFrame: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public render(ctx: CanvasRenderingContext2D) {
    this.animFrame++;
    
    // Gentle floating effect
    const floatOffset = Math.sin(this.animFrame * 0.1) * 1;
    
    // Cup body (matcha green)
    ctx.fillStyle = '#84CC16';
    ctx.fillRect(this.x + 2, this.y + 8 + floatOffset, 12, 14);
    
    // Cup rim
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x + 1, this.y + 7 + floatOffset, 14, 2);
    
    // Matcha foam/cream on top
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(this.x + 2, this.y + 4 + floatOffset, 12, 5);
    
    // Cup handle
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x + 16, this.y + 14 + floatOffset, 2, 0, Math.PI);
    ctx.stroke();
    
    // Straw
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(this.x + 7, this.y + 1 + floatOffset, 2, 8);
    
    // Collectible shine effect
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x + 4, this.y + 6 + floatOffset, 2, 2);
  }
}