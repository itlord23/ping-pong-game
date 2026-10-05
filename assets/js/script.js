
import { audioManager } from "./audio.js";
import { themeManager } from "./theme.js";
import { paddle } from "./entities/Paddle.js";
import { ball } from "./entities/Ball.js";
import { levels } from "./levelconfig.js";

const app = {
    ball,
    paddle,
    elements: {
        startBtn: document.getElementById("start-btn"),
        contBtn: document.getElementById("cont-btn"),
        toggleBtn: document.getElementById("theme-switcher"),
        title: document.getElementById("overlay-title"),
        subtitle: document.getElementById("overlay-subtitle"),
        overlayScreen: document.getElementById("overlay-screen"),
        heading: document.querySelector('.header__box .header__heading'),
        footer: document.querySelector('.footer'),
        tuong: document.getElementById('gameCanvas'),
        diem: document.getElementById('score-value'),
        mission: document.getElementById('mission-text'),
        levelValue: document.getElementById('level-value')
    },

    states: {
        gameState: 'menu',
        score: 0,
        level: 1,
        animationId: null
    },

    getCurrentLevel() {
        return levels[this.states.level - 1];
    },

    startGame() {
        if(this.elements.levelValue) {
            this.elements.levelValue.textContent = '01';
        }
        this.startLevel();
    },

    startLevel() {
        this.states.score = 0;
        this.elements.diem.textContent = this.states.score;
        // khởi tạo level
        const currentLevel = this.getCurrentLevel();
        if(currentLevel) {
            currentLevel.init(this);

            this.elements.heading.style.display = 'none';
            this.elements.mission.style.display = 'block';
            this.elements.mission.textContent = currentLevel.missionText;
        }

        // tạo nút chuyển màn

        this.states.gameState = 'playing';

        /** ẩn e */
        this.elements.toggleBtn.style.display = 'none';
        // this.elements.heading.parentElement.style.display = 'none';
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

        const currentLevel = this.getCurrentLevel();
        if(currentLevel) {
            currentLevel.draw(contextCv);
        }

        if(this.states.gameState === 'playing' || this.states.gameState === 'pause') {
            paddle.draw(contextCv);
            // vẽ bóng
            ball.draw(contextCv);
        }
    },

    handleGameOver() {
        this.states.gameState = 'gameover';
        if(this.states.animationId) {
            cancelAnimationFrame(this.states.animationId);
            this.states.animationId = null;
        }

        // hiển thị lại UI
        // hiển thị điểm kỷ lục
        if(audioManager.activeTrack) {
            audioManager.activeTrack.pause();
        }

        this.elements.title.textContent = "Bạn đã thua!";
        this.elements.startBtn.textContent = 'Chơi lại';
        this.elements.contBtn.textContent = 'Về Menu';
        this.elements.overlayScreen.style.display = 'flex';
    },

    handleCollisions() {
        // va chạm bóng - bệ đỡ
        if(
            ball.x + ball.radius >= paddle.x &&
            ball.x - ball.radius <= paddle.x + paddle.width &&
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height &&
            ball.dy > 0
        ) {
            const paddleCenter = paddle.x + paddle.width / 2;
            const hitPoint = (ball.x - paddleCenter) / (paddle.width / 2);
            const maxAngle = Math.PI / 3; // 60 degrees
            const bounceAngle = hitPoint * maxAngle;

            ball.dx = ball.speed * Math.sin(bounceAngle);
            ball.dy = -ball.speed * Math.cos(bounceAngle);

            ball.y = paddle.y - ball.radius; // Đặt lại vị trí của bóng để tránh va chạm liên tục
            // this.states.score += 10;

            const currentLevel = this.getCurrentLevel();
            if(currentLevel && currentLevel.onPaddleHit) {
                currentLevel.onPaddleHit(this);
            }
        }
        // va chạm bóng - 3 tường
        // va chạm bóng - vật khác (màn sau)
        // va chạm bóng - đáy dưới (end game)
        if(ball.y - ball.radius > this.elements.tuong.height) {
            this.handleGameOver();
        }
    },

    handleComplete() {
        this.states.gameState = 'levelcomplete';

        if(this.states.animationId) {
            cancelAnimationFrame(this.states.animationId);
            this.states.animationId = null;
        }

        this.elements.title.textContent = this.getCurrentLevel().aura_text;
        this.elements.startBtn.textContent = 'Chơi tiếp';
        
        this.elements.contBtn.textContent = 'Về Menu';
        this.elements.overlayScreen.style.display = 'flex';
    },

    nextLevel() {
        this.states.level += 1;
        if(this.elements.levelValue) {
            this.elements.levelValue.textContent = String(this.states.level).padStart(2, '0');
        }
        this.startLevel();
    },

    update() {
        if(this.states.gameState !== 'playing') return;

        const currentLevel = this.getCurrentLevel();
        if(currentLevel) {
            currentLevel.update(this);

            if(currentLevel.checkWin(this)) {
                this.handleComplete();
            }
        }

        // cập nhật cho paddle
        paddle.update(this.elements.tuong.width);
        // cập nhật cho bóng
        ball.update(this.elements.tuong.width, this.elements.tuong.height);
        // cập nhật điểm số, level
        this.elements.diem.textContent = this.states.score;
        this.elements.levelValue.textContent = String(this.states.level).padStart(2, '0');
        // xử lý va chạm collition trong game
        this.handleCollisions();
    },

    loop() {
        this.draw();
        this.update();

        this.states.animationId = requestAnimationFrame(() => this.loop());
    },

    handleEvents() {
        const {startBtn, toggleBtn, subtitle} = this.elements;
        startBtn.addEventListener('click', () => {
            switch (this.states.gameState) {
                case 'menu':
                case 'gameover':
                    this.startGame();
                    break;
                case 'levelcomplete':
                    this.nextLevel();
                    break;
            }
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