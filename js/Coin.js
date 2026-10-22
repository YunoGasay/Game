class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 20;
        this.collected = false;
        this.phase = Math.random() * Math.PI * 2; // для анимации
    }

    update(dt) {
        this.phase += dt * 4;
    }

    draw(ctx) {
        if (this.collected) return;
        const offset = Math.sin(this.phase) * 3;
        ctx.fillStyle = '#ffd54f';
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2, this.y + this.h / 2 + offset, this.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f9a825';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#fff9c4';
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2 - 3, this.y + this.h / 2 + offset - 3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}