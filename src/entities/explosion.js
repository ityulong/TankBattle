export class Explosion {
  constructor({ x, y, radius = 18, duration = 0.4 }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.duration = duration;
    this.elapsed = 0;
    this.alive = true;
  }

  update(dt) {
    this.elapsed += dt;
    if (this.elapsed >= this.duration) {
      this.alive = false;
    }
  }

  render(ctx) {
    if (!this.alive) return;
    const progress = this.elapsed / this.duration;
    const radius = this.radius * progress;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 200, 80, ${1 - progress})`;
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
