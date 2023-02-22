export default class Time {
  constructor() {
    this.start = Date.now();
    this.current = this.start;
    this.elapsedTime = 0;
    this.delta = 16;

    this.update();
  }

  update() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsedTime = this.current - this.start;

    window.requestAnimationFrame(() => this.update());
  }
}
