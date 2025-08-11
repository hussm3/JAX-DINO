export class InputHandler {
  private keys: { [key: string]: boolean } = {};

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
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
}