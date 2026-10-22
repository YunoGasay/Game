// Утилиты AABB-коллизий
const Collision = {
    // Пересечение двух прямоугольников
    intersects(a, b) {
        return a.x < b.x + b.w &&
               a.x + a.w > b.x &&
               a.y < b.y + b.h &&
               a.y + a.h > b.y;
    },

    // Разрешение коллизии по вертикали (для платформ)
    // Возвращает true, если игрок стоял на платформе
    resolveVertical(player, platform, prevY) {
        if (!this.intersects(player, platform)) return false;

        const playerBottomPrev = prevY + player.h;

        // Падение сверху
        if (player.vy > 0 && playerBottomPrev <= platform.y + 1) {
            player.y = platform.y - player.h;
            player.vy = 0;
            player.onGround = true;
            return true;
        }
        // Удар головой снизу
        if (player.vy < 0 && prevY >= platform.y + platform.h - 1) {
            player.y = platform.y + platform.h;
            player.vy = 0;
        }
        return false;
    },

    // Разрешение коллизии по горизонтали (стены)
    resolveHorizontal(player, platform) {
        if (!this.intersects(player, platform)) return;
        if (player.vx > 0) {
            player.x = platform.x - player.w;
        } else if (player.vx < 0) {
            player.x = platform.x + platform.w;
        }
        player.vx = 0;
    }
};