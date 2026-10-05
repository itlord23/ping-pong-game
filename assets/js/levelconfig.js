export const levels = [
    {
        level: 1,
        missionText: 'Nhiệm vụ: Giữ bóng nảy cho đến khi đạt 100 điểm',
        init(app) {

        },

        onPaddleHit(app) {
            app.states.score += 10;
            if (app.elements.diem) {
                app.elements.diem.textContent = app.states.score;
            }
        },
        
        update(app) {
            
        },

        draw(contextCv) {

        },

        checkWin(app) {
            return app.states.score >= 100;
        },
        aura_text: `Thật là bá khí! Qua màn 1`
    },
    {
        level: 2,
        missionText: 'Nhiệm vụ: Phá bức tường gạch và hứng quả táo',
        gach: [],
        apple: null,
        appleCollected: false,

        init(app) {
            this.appleCollected = false;
            this.gach = [];
            this.apple = null;
            const rows = 3;
            const cols = 3;
            const brickW = 80;
            const brickH = 25;
            const padding = 15;
            const offsetTop = 70;

            const totalGridWidth = cols * brickW + (cols - 1) * padding;
            const offsetLeft = (app.elements.tuong.width - totalGridWidth) / 2;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const brickX = offsetLeft + c * (brickW + padding);
                    const brickY = offsetTop + r * (brickH + padding);

                    const isAppleBrick = (r === 0 && c === 1);

                    this.gach.push({
                        row: r,
                        col: c,
                        x: brickX,
                        y: brickY,
                        width: brickW,
                        height: brickH,
                        alive: true,
                        hasApple: isAppleBrick
                    });
                }
            }
        },

        update(app) {
            const { ball, paddle } = app;
            // xử lý va chạm giữa bóng và gạch, cộng điểm
            this.gach.forEach(g => {
                if(g.alive) {
                    const hitLeft = ball.x + ball.radius >= g.x;
                    const hitRight = ball.x - ball.radius <= g.x + g.width;
                    const hitTop = ball.y + ball.radius >= g.y;
                    const hitBottom = ball.y - ball.radius <= g.y + g.height;

                    if(hitLeft && hitRight && hitTop && hitBottom) {
                        g.alive = false;

                        ball.dy = -ball.dy;

                        app.states.score += 10;

                        if(app.elements.diem) {
                            app.elements.diem.textContent = app.states.score;
                        }

                        // nếu mà chạm trúng gạch có quả táo
                        if(g.hasApple) {
                            this.apple = {
                                x: g.x + g.width / 2,
                                y: g.y + g.height,
                                radius: 12,
                                speed: 2.5 // tốc độ rơi
                            }
                        }
                    }
                 }
            });

            if(this.apple) {
                this.apple.y += this.apple.speed;
                const hitX = this.apple.x >= paddle.x && 
                            this.apple.x <= paddle.x + paddle.width;
                const hitY = this.apple.y + this.apple.radius >= paddle.y &&
                            this.apple.y - this.apple.radius <= paddle.y + paddle.height;

                if(hitX && hitY) {
                    this.appleCollected = true;
                    this.apple = null;
                } else if(this.apple && this.apple.y - this.apple.radius > app.elements.tuong.height) {
                    this.apple = null;
                    //
                }
            }
        },

        draw(contextCv) {
            this.gach.forEach(g => {
                if(g.alive) {
                    contextCv.fillStyle = g.hasApple ? '#ff0055' : '#00f3ff';
                    contextCv.fillRect(g.x, g.y, g.width, g.height);

                    // vẽ thêm viền
                    contextCv.strokeStyle = '#fff';
                    contextCv.lineWidth = 1.5;
                    contextCv.strokeRect(g.x, g.y, g.width, g.height);
                }
            });
            // vẽ quả táo đang rơi
            if(this.apple) {
                contextCv.beginPath();
                contextCv.arc(this.apple.x, this.apple.y, this.apple.radius, 0, Math.PI * 2);
                contextCv.fillStyle = '#ff2a2a';
                contextCv.fill();
                contextCv.closePath();

                contextCv.beginPath();
                contextCv.fillStyle = '#5c3a21';
                contextCv.fillRect(this.apple.x - 1, this.apple.y - this.apple.radius - 4, 2, 5);
                contextCv.closePath();

                contextCv.beginPath();
                contextCv.arc(this.apple.x + 3, this.apple.y - this.apple.radius - 2, 3, 0, Math.PI * 2);
                contextCv.fillStyle = '#22cc44';
                contextCv.fill();
                contextCv.closePath();
            }
        },

        checkWin(app) {
            return this.appleCollected;
        },
        aura_text: `Anh Long, Anh Long! Qua màn 2`
    }
]