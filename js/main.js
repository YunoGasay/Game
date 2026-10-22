window.addEventListener('load', () => {
    const canvas = document.getElementById('game-canvas');
    const hud = {
        score: document.getElementById('score'),
        lives: document.getElementById('lives'),
        level: document.getElementById('level')
    };

    const game = new Game(canvas, hud);
    game.updateHUD();

    // Демонстрация: игра запускается по кнопке «Начать игру»
    document.getElementById('start-btn').addEventListener('click', () => game.start());
});
