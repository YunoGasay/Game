class InputHandler {
    constructor() {
        this.keys = {};
        this.justPressed = {};

        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) this.justPressed[e.code] = true;
            this.keys[e.code] = true;
            // Запрет прокрутки страницы при управлении
            if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isDown(...codes) {
        return codes.some(c => this.keys[c]);
    }

    wasPressed(...codes) {
        return codes.some(c => this.justPressed[c]);
    }

    // Вызывается в конце кадра
    clearFrame() {
        this.justPressed = {};
    }
}