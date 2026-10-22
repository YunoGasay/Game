class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 44;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.facing = 1; // 1 — вправо, -1 — влево
        this.invulnerable = 0; // сек
        this.animTime = 0;
    }

    update(dt, input, platforms) {
        // --- Горизонтальное движение ---
        const speed = 260; // px/sec
        const accel = 2000;
        const friction = 2400;
        const maxSpeed = 260;

        let dir = 0;
        if (input.isDown('KeyA', 'ArrowLeft')) dir -= 1;
        if (input.isDown('KeyD', 'ArrowRight')) dir += 1;

        if (dir !== 0) {
            this.facing = dir;
            this.vx += dir * accel * dt;
            if (Math.abs(this.vx) > maxSpeed) this.vx = Math.sign(this.vx) * maxSpeed;
        } else {
            // трение
            if (this.vx > 0) {
                this.vx = Math.max(0, this.vx - friction * dt);
            } else if (this.vx < 0) {
                this.vx = Math.min(0, this.vx + friction * dt);
            }
        }

        // --- Прыжок ---
        const jumpPressed = input.wasPressed('Space', 'KeyW', 'ArrowUp');
        if (jumpPressed && this.onGround) {
            this.vy = -620;
            this.onGround = false;
        }

        // --- Гравитация ---
        this.vy += 1600 * dt;
        if (this.vy > 1200) this.vy = 1200;

        // --- Обновление позиции по X и коллизии ---
        this.x += this.vx * dt;
        for (const p of platforms) {
            Collision.resolveHorizontal(this, p);
        }
        // Границы экрана
        if (this.x < 0) { this.x = 0; this.vx = 0; }
        const worldWidth = 2400;
        if (this.x + this.w > worldWidth) { this.x = worldWidth - this.w; this.vx = 0; }

        // --- Обновление по Y и коллизии ---
        const prevY = this.y;
        this.y += this.vy * dt;
        this.onGround = false;
        for (const p of platforms) {
            Collision.resolveVertical(this, p, prevY);
        }

        // Падение ниже уровня — смерть
        if (this.y > 700) {
            return false; // сигнал: игрок упал
        }

        if (this.invulnerable > 0) this.invulnerable -= dt;

        // анимация
        if (Math.abs(this.vx) > 10 || !this.onGround) this.animTime += dt;
        return true;
    }

    hit() {
        if (this.invulnerable > 0) return false;
        this.invulnerable = 1.5;
        return true;
    }

    draw(ctx) {
        // Мерцание при неуязвимости
        if (this.invulnerable > 0 && Math.floor(this.invulnerable * 10) % 2 === 0) return;

        const cx = this.x + this.w / 2;
        const bob = this.onGround && Math.abs(this.vx) > 10
            ? Math.sin(this.animTime * 18) * 2 : 0;

        // Тело
        ctx.fillStyle = '#1e88e5';
        ctx.fillRect(this.x + 4, this.y + 10 + bob, this.w - 8, this.h - 10);

        // Голова
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.arc(cx, this.y + 12 + bob, 12, 0, Math.PI * 2);
        ctx.fill();

        // Глаза (смотрят по направлению движения)
        ctx.fillStyle = '#000';
        const eyeX = cx + this.facing * 4;
        ctx.beginPath();
        ctx.arc(eyeX - 3, this.y + 10 + bob, 2.5, 0, Math.PI * 2);
        ctx.arc(eyeX + 4, this.y + 10 + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Ноги
        ctx.fillStyle = '#0d47a1';
        const legOffset = Math.sin(this.animTime * 18) * 5;
        ctx.fillRect(this.x + 6, this.y + this.h - 6 + bob, 8, 8 + legOffset);
        ctx.fillRect(this.x + this.w - 14, this.y + this.h - 6 + bob, 8, 8 - legOffset);
    }
}