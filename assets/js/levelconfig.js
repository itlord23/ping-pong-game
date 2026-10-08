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
        aura_text: `Kiên nhẫn mới tạo ra kim cương! Qua màn 1`
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
        aura_text: `Gong Xi! Qua màn 2`
    },
    {
        level: 3,
        missionText: 'Nhiệm vụ: Hạ gục con boss trước khi nó giết bạn',
        boss: null,
        bullets: [],
        lastShotTime: 0,
        shootInterval: 90,
        init(app) {
            this.bullets = [];
            this.boss = {
                x: app.elements.tuong.width / 2 - 45,
                y: 40,
                width: 80,
                height: 35,
                speedX: 4.5,
                hp: 5,
                maxHp: 5
            }
        },

        update(app) {
            const { ball, paddle } = app;
            if(!this.boss || this.boss.hp <= 0) return;
            // di chuyển của boss
            this.boss.x += this.boss.speedX;
            if(this.boss.x <= 0 || this.boss.x + this.boss.width >= app.elements.tuong.width) {
                this.boss.speedX *= -1; // đảo chiều
            }
            const hitBossX = ball.x + ball.radius >= this.boss.x &&
                        ball.x - ball.radius <= this.boss.x + this.boss.width;
            const hitBossY = ball.y + ball.radius >= this.boss.y &&
                        ball.y - ball.radius <= this.boss.y + this.boss.height;

            if(hitBossX && hitBossY) {
                ball.dy = -ball.dy;
                ball.y = this.boss.y + this.boss.height + ball.radius;
                this.boss.hp -= 1;

                app.states.score += 20;

                if(app.elements.diem) {
                    app.elements.diem.textContent = app.states.score;
                }
            }

            // boss bắn đạn xuống
            this.lastShotTime++;
            if(this.lastShotTime >= this.shootInterval) {
                this.lastShotTime = 0;
                this.bullets.push({
                    x: this.boss.x + this.boss.width / 2 - 3,
                    y: this.boss.y + this.boss.height,
                    width: 6,
                    height: 15,
                    speedY: 4
                });
            }

            // xử lý đan va chạm với bệ đỡ
            for (let index = this.bullets.length - 1; index >= 0; index--) {
                const element = this.bullets[index];
                element.y += element.speedY;

                const hitPaddleX = element.x + element.width >= paddle.x && 
                               element.x <= paddle.x + paddle.width;
                const hitPaddleY = element.y + element.height >= paddle.y && 
                               element.y <= paddle.y + paddle.height;

                if (hitPaddleX && hitPaddleY) {
                    app.handleGameOver();
                    return;
                }

                if (element.y > app.elements.tuong.height) {
                    this.bullets.splice(index, 1);
                }
            }
        },

        draw(contextCv) {
            if (!this.boss || this.boss.hp <= 0) return;

            contextCv.fillStyle = '#ff0055';
            contextCv.fillRect(this.boss.x, this.boss.y, this.boss.width, this.boss.height);
            contextCv.strokeStyle = '#ffffff';
            contextCv.lineWidth = 2;
            contextCv.strokeRect(this.boss.x, this.boss.y, this.boss.width, this.boss.height);

            const hpBarW = this.boss.width;
            const hpRatio = this.boss.hp / this.boss.maxHp;

            contextCv.fillStyle = 'rgba(0, 0, 0, 0.42)';
            contextCv.fillRect(this.boss.x, this.boss.y - 12, hpBarW, 6);

            contextCv.fillStyle = hpRatio > 0.4 ? '#00ff66' : '#ff2200';
            contextCv.fillRect(this.boss.x, this.boss.y - 12, hpBarW * hpRatio, 6);

            // vẽ đạn
            contextCv.fillStyle = '#ffea00';
            this.bullets.forEach(b => {
                contextCv.fillRect(b.x, b.y, b.width, b.height);
                contextCv.strokeStyle = '#ff2200';
                contextCv.lineWidth = 1;
                contextCv.strokeRect(b.x, b.y, b.width, b.height);
            });
        },

        checkWin(app) {
            return this.boss && this.boss.hp <= 0;
        },
        aura_text: `Bạn tài giỏi thì kệ bạn! Qua màn 3`
    }
]