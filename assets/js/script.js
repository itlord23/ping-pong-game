
import { audioManager } from "./audio.js";
import { themeManager } from "./theme.js";
import { paddle } from "./entities/Paddle.js";
import { ball } from "./entities/Ball.js";

const app = {
    elements: {
        startBtn: document.getElementById("start-btn"),
        toggleBtn: document.getElementById("theme-switcher"),
        subtitle: document.getElementById("overlay-subtitle"),
        overlayScreen: document.getElementById("overlay-screen"),
        heading: document.querySelector('.header__box .header__heading'),
        footer: document.querySelector('.footer'),
        tuong: document.getElementById('gameCanvas')
    },

    states: {
        gameState: 'menu',
        score: 0,
        level: 1,
        animationId: null
    },

    startGame() {
        this.states.gameState = 'playing';

        /** ẩn e */
        this.elements.toggleBtn.style.display = 'none';
        this.elements.heading.parentElement.style.display = 'none';
        this.elements.overlayScreen.style.display = 'none';
        this.elements.footer.style.display = 'none';

        /** reset bệ đỡ, bóng */
        paddle.reset(this.elements.tuong.width);
        ball.reset(this.elements.tuong.width, this.elements.tuong.height);

        /** đổi nhạc */
        audioManager.play(themeManager.currentTheme, 'game');
        if(!this.states.animationId) {
            this.loop();
        }
    },

    draw() {
        const canvas = this.elements.tuong;
        const contextCv = canvas.getContext('2d');

        contextCv.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        if(this.states.gameState === 'playing' || this.states.gameState === 'pause') {
            paddle.draw(contextCv);
            // vẽ bóng
            ball.draw(contextCv);
        }
    },

    update() {
        if(this.states.gameState !== 'playing') return;

        // cập nhật cho paddle
        paddle.update(this.elements.tuong.width);
        // cập nhật cho bóng
        ball.update(this.elements.tuong.width, this.elements.tuong.height);
        // xử lý va chạm collition trong game
    },

    loop() {
        this.draw();
        this.update();

        this.states.animationId = requestAnimationFrame(() => this.loop());
    },

    handleEvents() {
        const {startBtn, toggleBtn, subtitle} = this.elements;
        startBtn.addEventListener('click', () => {
            this.startGame();
            if(subtitle) {
                subtitle.style.display = "none";
            }
        });

        document.addEventListener('keydown', (e) => paddle.handleKeyDown(e));
        document.addEventListener('keyup', (e) => paddle.handleKeyUp(e));

        toggleBtn.addEventListener('click', (e) => {
            const currentTheme = themeManager.toggle(e.currentTarget);
            /** */
            audioManager.play(currentTheme, 'menu');
        });
    },

    start() {
        audioManager.init(() => themeManager.currentTheme);

        this.handleEvents();
    }
};

app.start();