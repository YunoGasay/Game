class Enemy {
    constructor(x, y, minX, maxX) {
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 32;
        this.minX = minX;
        this.maxX = maxX;
        this.vx = 60; // px/sec
        this.alive = true;
        this.phase = 0;
    }

    update(dt) {
        if (!this.alive) return;
        this.x += this.vx * dt;
        if (this.x <= this.minX) { this.x = this.minX; this.vx = Math.abs(this.vx); }
        if (this.x + this.w >= this.maxX) { this.x = this.maxX - this.w; this.vx = -Math.abs(this.vx); }
        this.phase += dt * 8;
    }

    draw(ctx) {
        if (!this.alive) return;
        const bob = Math.sin(this.phase) * 2;
        ctx.fillStyle = '#e53935';
        ctx.beginPath();
        ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2 + bob, this.w / 2, this.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Глаза
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + this.h / 2 - 4 + bob, 4, 0, Math.PI * 2);
        ctx.arc(this.x + 22, this.y + this.h / 2 - 4 + bob, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + this.h / 2 - 4 + bob, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 22, this.y + this.h / 2 - 4 + bob, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}