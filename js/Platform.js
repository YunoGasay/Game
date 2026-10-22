class Platform {
    constructor(x, y, w, h, type = 'normal') {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.type = type; // 'normal' | 'ground' | 'goal'
    }

    draw(ctx) {
                if (this.type === 'goal') {
                    // Центр флага
                    const cx = this.x + this.w / 2;
                    
                    // Древко (ровно по центру)
                    ctx.fillStyle = '#795548';
                    ctx.fillRect(cx - 4, this.y, 8, this.h);
                    
                    // Флаг (треугольник, отходящий вправо от древка)
                    ctx.fillStyle = '#43a047';
                    ctx.beginPath();
                    ctx.moveTo(cx + 4, this.y + 10);
                    ctx.lineTo(cx + 40, this.y + 30);
                    ctx.lineTo(cx + 4, this.y + 50);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Звездочка на флаге
                    ctx.fillStyle = '#ffd54f';
                    ctx.beginPath();
                    ctx.arc(cx + 16, this.y + 30, 5, 0, Math.PI * 2);
                    ctx.fill();
                } else if (this.type === 'ground') {
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#4caf50';
            ctx.fillRect(this.x, this.y, this.w, 8);
        } else {
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#a1887f';
            ctx.fillRect(this.x, this.y, this.w, 6);
        }
    }
}