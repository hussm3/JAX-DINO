export class InputHandler {
  private keys: { [key: string]: boolean } = {};
  private mouseX: number = 0;
  private mouseY: number = 0;
  private mouseClicked: boolean = false;

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    
    window.addEventListener('mousemove', (e) => {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
    
    window.addEventListener('mousedown', (e) => {
      this.mouseClicked = true;
    });
    
    window.addEventListener('mouseup', (e) => {
      this.mouseClicked = false;
    });
  }

  public isPressed(key: string): boolean {
    return !!this.keys[key];
  }

  public get left(): boolean {
    return this.isPressed('ArrowLeft');
  }

  public get right(): boolean {
    return this.isPressed('ArrowRight');
  }

  public get jump(): boolean {
    return this.isPressed('Space') || this.isPressed('ArrowUp');
  }
  
  public get escape(): boolean {
    return this.isPressed('Escape');
  }
  
  public getMousePosition(): {x: number, y: number} {
    return {x: this.mouseX, y: this.mouseY};
  }
  
  public isMouseClicked(): boolean {
    const clicked = this.mouseClicked;
    this.mouseClicked = false; // Reset after reading
    return clicked;
  }
}