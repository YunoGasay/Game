class Game {
    constructor(canvas, hudElements) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.input = new InputHandler();
        this.hud = hudElements;

        this.state = 'menu'; // 'menu' | 'playing' | 'paused' | 'won' | 'lost'
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.worldWidth = 2400;
        this.levelGoalScore = 0;

        this.lastTime = 0;
        this.accumulator = 0;
        this.FIXED_DT = 1 / 120;

        this.initLevel(1);
        this.bindUI();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    bindUI() {
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
    }

    showOverlay(html) {
        const ov = document.getElementById('overlay');
        ov.innerHTML = html;
        ov.classList.remove('hidden');
    }

    hideOverlay() {
        document.getElementById('overlay').classList.add('hidden');
    }

   initLevel(level) {
        this.level = level;
        this.player = new Player(60, 380);
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        this.goal = null;
        
        // ВАЖНО: levelGoalScore здесь не сбрасываем в 0, 
        // чтобы сохранить прогресс монет при смерти!

        // Общие платформы
        this.platforms.push(new Platform(0, 500, this.worldWidth, 40, 'ground'));

        if (level === 1) {
            this.platforms.push(new Platform(200, 400, 140, 20));
            this.platforms.push(new Platform(420, 320, 140, 20));
            this.platforms.push(new Platform(650, 400, 160, 20));
            this.platforms.push(new Platform(900, 300, 140, 20));
            this.platforms.push(new Platform(1150, 400, 160, 20));
            this.platforms.push(new Platform(1450, 340, 160, 20));
            this.platforms.push(new Platform(1750, 420, 200, 20));

            this.addCoinsAlong([[230, 360], [460, 280], [700, 360], [940, 260], [1200, 360], [1500, 300]]);
            this.enemies.push(new Enemy(700, 460, 650, 810));
            this.enemies.push(new Enemy(1200, 460, 1150, 1310));

            // ИСПРАВЛЕНО: Платформа под флагом (центр 2230)
            this.goal = new Platform(2200, 340, 60, 80, 'goal');
            this.platforms.push(new Platform(2160, 420, 140, 20));
        } else {
            this.platforms.push(new Platform(180, 420, 100, 18));
            this.platforms.push(new Platform(340, 340, 100, 18));
            this.platforms.push(new Platform(520, 260, 100, 18));
            this.platforms.push(new Platform(700, 340, 100, 18));
            this.platforms.push(new Platform(900, 260, 100, 18));
            this.platforms.push(new Platform(1100, 380, 100, 18));
            this.platforms.push(new Platform(1300, 300, 100, 18));
            this.platforms.push(new Platform(1500, 220, 100, 18));
            this.platforms.push(new Platform(1700, 340, 100, 18));
            this.platforms.push(new Platform(1900, 420, 120, 18));

            this.addCoinsAlong([[210, 380], [370, 300], [550, 220], [730, 300], [930, 220], [1130, 340], [1330, 260], [1530, 180], [1730, 300]]);
            this.enemies.push(new Enemy(500, 460, 400, 700));
            this.enemies.push(new Enemy(1100, 460, 1000, 1400));
            this.enemies.push(new Enemy(1600, 460, 1500, 1900));

            // ИСПРАВЛЕНО: Платформа под флагом (центр 2250)
            this.goal = new Platform(2220, 260, 60, 80, 'goal');
            this.platforms.push(new Platform(2180, 340, 140, 20));
        }

        // Если это первый запуск уровня (или полный рестарт), 
        // то задаем общее количество монет
        if (this.levelGoalScore === 0) {
            this.levelGoalScore = this.coins.length;
        }
    }

    addCoinsAlong(points) {
        for (const [x, y] of points) {
            for (let i = 0; i < 3; i++) {
                this.coins.push(new Coin(x + i * 30, y));
            }
        }
    }

    start() {
        this.state = 'playing';
        this.hideOverlay();
        document.querySelector('.game-ui').style.display = 'flex';
    }

    restart() {
        this.score = 0;
        this.lives = 3;
        this.levelGoalScore = 0; // Сбрасываем прогресс монет для новой игры
        this.initLevel(1);
        this.state = 'playing';
        this.hideOverlay();
        this.updateHUD();
    }

    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            this.showOverlay('<h1>Пауза</h1><p>Нажмите «Пауза» ещё раз, чтобы продолжить</p>');
        } else if (this.state === 'paused') {
            this.state = 'playing';
            this.hideOverlay();
        }
    }

    loseLife() {
        if (this.lives <= 0) return;
        this.lives--;
        this.updateHUD();
        
        if (this.lives <= 0) {
            this.state = 'lost';
            this.showOverlay('<h1>Поражение</h1><p>Жизни закончились</p><button onclick="location.reload()">Начать заново</button>');
        } else {
            // СОХРАНЯЕМ прогресс монет
            const savedScore = this.score;
            const savedLives = this.lives;
            const collectedStatus = this.coins.map(c => c.collected);

            // Пересоздаем уровень
            this.initLevel(this.level);

            // Восстанавливаем данные
            this.score = savedScore;
            this.lives = savedLives;

            // Применяем сохраненный статус монет
            for (let i = 0; i < this.coins.length; i++) {
                if (collectedStatus[i] !== undefined) {
                    this.coins[i].collected = collectedStatus[i];
                }
            }

            this.updateHUD();
        }
    }

    winLevel() {
        if (this.level === 1) {
            this.score += 50;
            this.levelGoalScore = 0; // Сброс для второго уровня
            this.initLevel(2);
            this.levelGoalScore = this.coins.length; // Устанавливаем новое количество
            this.updateHUD();
            this.state = 'paused';
            this.showOverlay('<h1>Уровень 1 пройден!</h1><p>+50 очков. Готовы ко второму уровню?</p><button id="next-btn">Далее</button>');
            document.getElementById('next-btn').addEventListener('click', () => {
                this.hideOverlay();
                this.state = 'playing';
            });
        } else {
            this.state = 'won';
            this.showOverlay(`<h1>Победа!</h1><p>Итоговый счёт: ${this.score}</p><button onclick="location.reload()">Играть снова</button>`);
        }
    }

    updateHUD() {
        this.hud.score.textContent = 'Очки: ' + this.score;
        this.hud.lives.textContent = 'Жизни: ' + this.lives;
        this.hud.level.textContent = 'Уровень: ' + this.level;
    }

    update(dt) {
        if (this.state !== 'playing') return;

        // Обновление игрока
        const alive = this.player.update(dt, this.input, this.platforms, this.worldWidth);
        if (!alive) {
            this.loseLife();
            return;
        }

        // Обновление монет
        for (const coin of this.coins) {
            coin.update(dt);
            if (!coin.collected && Collision.intersects(this.player, coin)) {
                coin.collected = true;
                this.score += 10;
                this.updateHUD();
            }
        }

        // Обновление врагов + коллизии
        for (const enemy of this.enemies) {
            enemy.update(dt);
            if (enemy.alive && Collision.intersects(this.player, enemy)) {
                const hit = this.player.hit();
                if (hit) {
                    this.loseLife();
                    return;
                }
            }
        }

        // Проверка финиша
        if (this.goal && Collision.intersects(this.player, this.goal)) {
            this.winLevel();
            return;
        }
    }

    updateCamera() {
        const target = this.player.x - this.renderer.W / 3;
        this.renderer.cameraX += (target - this.renderer.cameraX) * 0.12;
        if (this.renderer.cameraX < 0) this.renderer.cameraX = 0;
        const maxCam = this.worldWidth - this.renderer.W;
        if (this.renderer.cameraX > maxCam) this.renderer.cameraX = maxCam;
    }

   render() {
        const r = this.renderer;
        r.clear();
        r.drawBackground();

        const ctx = r.ctx;

        // Отрисовка холмов (параллакс) с защитой от задвоения первого холма
        ctx.fillStyle = 'rgba(129,199,132,0.5)';
        const hillShift = -r.cameraX * 0.35;
        const totalHillsWidth = r.W + 600;
        
        for (let i = 0; i < 6; i++) {
            // Вычисляем позицию. Используем Math.floor для стабильности и 
            // берем остаток так, чтобы он всегда был положительным.
            let hx = (i * 500 + hillShift) % totalHillsWidth;
            if (hx < 0) hx += totalHillsWidth;
            hx -= 300; // Смещаем назад, чтобы холм плавно уходил за левый край

            ctx.beginPath();
            // Холмы опущены на уровень земли (r.H - 40)
            ctx.arc(hx, r.H - 40, 180, Math.PI, 0);
            ctx.fill();
        }

        ctx.save();
        ctx.translate(-r.cameraX, 0);

        // Платформы
        for (const p of this.platforms) p.draw(ctx);
        // Монеты
        for (const c of this.coins) c.draw(ctx);
        // Враги
        for (const e of this.enemies) e.draw(ctx);
        // Финиш
        if (this.goal) this.goal.draw(ctx);
        // Игрок
        if (this.state !== 'menu') this.player.draw(ctx);

        ctx.restore();

        // Мини-подсказка при паузе
        if (this.state === 'paused') {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(0, 0, r.W, r.H);
        }
    }

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        let delta = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        if (delta > 0.1) delta = 0.1; // защита от больших скачков

        // Fixed timestep accumulator
        this.accumulator += delta;
        while (this.accumulator >= this.FIXED_DT) {
            this.update(this.FIXED_DT);
            this.accumulator -= this.FIXED_DT;
        }

        this.updateCamera();
        this.render();
        this.input.clearFrame();

        requestAnimationFrame(this.loop);
    }
}