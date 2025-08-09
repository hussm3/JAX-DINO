export class Platform {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public render(ctx: CanvasRenderingContext2D) {
    // Platform base
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Grass on top
    if (this.height > 30) {
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(this.x, this.y, this.width, 8);
      
      // Grass blades
      ctx.fillStyle = '#16A34A';
      for (let i = 0; i < this.width; i += 10) {
        ctx.fillRect(this.x + i, this.y - 3, 2, 6);
        ctx.fillRect(this.x + i + 5, this.y - 2, 2, 4);
      }
    }
    
    // Platform edge highlights
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(this.x, this.y, this.width, 3);
    ctx.fillRect(this.x, this.y, 3, this.height);
  }
}