class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cameraX = 0;
        this.W = canvas.width;
        this.H = canvas.height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.W, this.H);
    }

    // Параллакс-фон
    drawBackground() {
        const ctx = this.ctx;
        const grad = ctx.createLinearGradient(0, 0, 0, this.H);
        grad.addColorStop(0, '#87ceeb');
        grad.addColorStop(0.6, '#c9e9ff');
        grad.addColorStop(1, '#e8f5e9');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.W, this.H);

        // Дальние облака
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        const cloudShift = -this.cameraX * 0.15;
        for (let i = 0; i < 6; i++) {
            const bx = ((i * 400 + cloudShift) % (this.W + 300)) - 150;
            const by = 40 + (i % 3) * 40;
            this.drawCloud(bx, by, 60 + (i % 3) * 20);
        }

        // Холмы (средний план)
        ctx.fillStyle = 'rgba(129,199,132,0.5)';
        const hillShift = -this.cameraX * 0.35;
        for (let i = 0; i < 5; i++) {
            const hx = ((i * 500 + hillShift) % (this.W + 600)) - 300;
            ctx.beginPath();
            ctx.arc(hx, this.H - 40, 180, Math.PI, 0);
            ctx.fill();
        }
    }

    drawCloud(x, y, r) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
        ctx.arc(x + r * 0.5, y - 10, r * 0.5, 0, Math.PI * 2);
        ctx.arc(x + r, y, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }

    // Перевод мировых координат в экранные
    toScreen(x, y) {
        return { x: x - this.cameraX, y: y };
    }
}