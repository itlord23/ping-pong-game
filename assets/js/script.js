// module audio
const audioManager = {
    isUnlocked: false,
    activeTrack: null,
    tracks : {
        neon : {
            menu : new Audio('./assets/audio/retro.mkv'),
            game : new Audio('')
        },
        arcade : {
            menu: new Audio('./assets/audio/aka.mkv'),
            game: new Audio('./assets/audio/practice.mkv')
        }
    },
    
    init(getCurrentTheme) {
        Object.values(this.tracks).forEach(themeObj => {
            Object.values(themeObj).forEach(audio => {
                audio.loop = true;
                audio.volume = 0.4;
            });
        });
        /** Xử lý unlocked event */
        this.handleUnlockedEvents(getCurrentTheme);    
    },

    handleUnlockedEvents(getCurrentTheme) {
        const unlock = () => {
            this.isUnlocked = true;

            const theme = getCurrentTheme ? getCurrentTheme() : 'neon';
            this.play(theme, 'menu');
            document.removeEventListener('click', unlock);
        }

        document.addEventListener('click', unlock);
    },

    play(theme, type) {
        if(!this.isUnlocked) return;

        /** Đang phát */
        if(this.activeTrack) {
            this.activeTrack.pause();
            this.activeTrack.currentTime = 0;
        }

        const track = this.tracks[theme]?.[type]
        if(track) {
            this.activeTrack = track;
            track.play().catch(() => {});
        }
    }
};

// module theme
const themeManager = {
    currentTheme: 'neon',
    wrapped: document.querySelector('.wrapped'),

    /* Giao diện đầu game, xử lý chuyển theme */
    toggle (btn) {
        const isNeon = this.wrapped.classList.contains("theme-neon");
        if (isNeon) {
            this.wrapped.classList.replace("theme-neon", "theme-arcade");
            if(btn) btn.textContent = "Cyber Neon";
            this.currentTheme = 'arcade';
        } else {
            this.wrapped.classList.replace("theme-arcade", "theme-neon");
            if(btn) btn.textContent = "Retro Arcade";
            this.currentTheme = 'neon';
        }
        
        return this.currentTheme;
    }
};

// hàm common
function vaChamTronVuong(ob1, ob2) {
    const hitX = ob1.x + ob1.radius >= ob2.x &&
                ob1.x - ob1.radius <= ob2.x + ob2.width;
    const hitY = ob1.y + ob1.radius >= ob2.y &&
                ob1.y - ob1.radius <= ob2.y + ob2.height;
    return hitX && hitY;
}

function vaChamTheoTam(ob1, ob2) {
    const hitPaddleX = ob1.x >= ob2.x && ob1.x <= ob2.x + ob2.width;
    const hitPaddleY = ob1.y + ob1.radius >= ob2.y &&
                    ob1.y - ob1.radius <= ob2.y + ob2.height;
    return hitPaddleX && hitPaddleY;
}

function vaChamCNCN(ob1, ob2) {
    const hitPaddleX = ob1.x + ob1.width >= ob2.x && 
                    ob1.x <= ob2.x + ob2.width;
    const hitPaddleY = ob1.y + ob1.height >= ob2.y && 
                    ob1.y <= ob2.y + ob2.height;
    return hitPaddleX && hitPaddleY;
}

// ct tính khoảng cách tâm hai đường tròn
function khoangCachTamHaiDuongTron(o1, o2) {
    return Math.sqrt(Math.pow((o1.x-o2.x), 2) + Math.pow((o1.y-o2.y), 2));
}

function hasCollision(ball, cong) {
    const dist = khoangCachTamHaiDuongTron(ball, cong);
    return dist <= ball.radius + cong.radius;
}

// bóng
const ball = {
    x: 0,
    y: 0,
    radius: 8,
    speed: 5,
    dx: 8,
    dy: 0,

    getRandomAngleDegrees(min, max) {
        const angle = Math.random() * (max - min) + min;
        return angle * (Math.PI / 180);
    },

    reset(width, height) {
        this.x = width / 2;
        this.y = height / 2;
        const angle = this.getRandomAngleDegrees(-45, 45);
        const directionY = Math.random() < 0.5 ? -1 : 1;
        this.dx = this.speed * Math.sin(angle);
        this.dy = this.speed * Math.cos(angle) * directionY;
    },
    
    update(width, height) {
        this.x += this.dx;
        this.y += this.dy;

        if(this.x - this.radius <= 0) {
            this.x = this.radius;
            this.dx = Math.abs(this.dx);
        } else if(this.x + this.radius >= width) {
            this.x = width - this.radius;
            this.dx = -Math.abs(this.dx);
        }

        if(this.y - this.radius <= 0) {
            this.y = this.radius;
            this.dy = Math.abs(this.dy);
        }
    },

    draw(contextCv) {
        contextCv.beginPath();
        contextCv.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        contextCv.fillStyle = "#fff";
        contextCv.fill();
        contextCv.closePath();
    },
};

// bệ đỡ
const paddle = {
    x: 450,
    y: 450,
    width: 100,
    height: 15,
    speed: 8,
    dx: 0,
    isMirrorActive: false,
    isLeftDown: false,
    isRightDown: false,

    reset(width) {
        // cho nằm giữa
        this.x = (width - this.width) / 2;
        this.dx = 0;
        this.isMirrorActive = false;
        this.isLeftDown = false;
        this.isRightDown = false;
    },
    
    update(width) {
        let moveLeft = this.isLeftDown;
        let moveRight = this.isRightDown;

        if(this.isMirrorActive) {
            const temp = moveLeft;
            moveLeft = moveRight;
            moveRight = temp;
        }

        // xác định vận tốc
        if(moveLeft && !moveRight) {
            this.dx = -this.speed;
        } else if(moveRight && !moveLeft) {
            this.dx = this.speed;
        } else {
            this.dx = 0;
        }

        this.x += this.dx;

        if(this.x < 0) {
            this.x = 0;
        }

        if(this.x + this.width > width) {
            this.x = width - this.width;
        }
    },

    draw(contextCv) {
        contextCv.fillStyle = '#fff';
        contextCv.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    },

    handleKeyDown(e) {
        if(e.key === 'ArrowLeft' || e.key === 'a') this.isLeftDown = true;
        if(e.key === 'ArrowRight' || e.key === 'd') this.isRightDown = true;
    },

    handleKeyUp(e) {
        if(e.key === 'ArrowLeft' || e.key === 'a') this.isLeftDown = false;
        if(e.key === 'ArrowRight' || e.key === 'd') this.isRightDown = false;
    }
};

// kịch bản các level
const levels = [
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
        aura_text: `Qua màn 1: Sơ Tâm (Tịnh giới)`
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
                    if(vaChamTronVuong(ball, g)) {
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
                                speed: 3.5 // tốc độ rơi
                            }
                        }
                    }
                    }
            });

            if(this.apple) {
                this.apple.y += this.apple.speed;

                if(vaChamTheoTam(this.apple, paddle)) {
                    this.appleCollected = true;
                    this.apple = null;
                } else if(this.apple && this.apple.y - this.apple.radius > app.elements.tuong.height) {
                    this.apple = null;
                    app.handleGameOver();
                    return;
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
        aura_text: `Qua màn 2: Phá lãng (Sóng cuộn)`
    },
    {
        level: 3,
        missionText: 'Nhiệm vụ: Hạ gục con boss trước khi nó giết bạn!',
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

            if(vaChamTronVuong(ball, this.boss)) {
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
                    x: this.boss.x + (this.boss.width / 2) - 3,
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

                if (vaChamCNCN(element, paddle)) {
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
        aura_text: `Qua màn 3: Lôi Động (Sấm sét)`
    },
    {
        level: 4,
        missionText: "Nhiệm vụ: Vô hiệu hóa cánh cổng đỏ kết nối với thế giới Hiện Thực chỉ khi đi qua cánh cổng vàng của Xi Wang",
        congA: null,
        congB: null,
        hasEnteredA: false,
        isWin: false,
        readyToWin: false,
        winTimer: 0,
        timerA: 600,
        isAExpired: false,

        init(app) {
            this.hasEnteredA = false;
            this.isWin = false;
            this.readyToWin = false;
            this.winTimer = 0;

            this.congA = {
                x: 100,
                y: 100,
                radius: 15,
                color: '#e4fe21'
            };

            this.congB = {
                x: app.elements.tuong.width - 100,
                y: 100,
                radius: 30,
                color: '#ff000d',
                isDeactivated: false
            };
        },

        update(app) {
            const { ball } = app;
            // đếm thời gian
            if(this.isWin && !this.readyToWin) {
                this.winTimer++;
                ball.dx = 0;
                ball.dy = 0;
                if(this.winTimer >= 180) {
                    this.readyToWin = true;
                }
                return;
            }

            if(this.readyToWin) return;

            // Va chạm cổng A           
            if(hasCollision(ball, this.congA)) {
                if(!this.hasEnteredA) {
                    this.hasEnteredA = true;

                    ball.dy = -Math.abs(ball.dy);
                    ball.dx = Math.abs(ball.speed);
                }
            }
            // Đi qua cổng B
            if(hasCollision(ball, this.congB)) {
                if(this.hasEnteredA) {
                    this.congB.color = '#00ff66';
                    this.congB.isDeactivated = true;
                    this.isWin = true;

                    app.states.score += 30;
                    if(app.elements.diem) {
                        app.elements.diem.textContent = app.states.score;
                    }
                }
                    else {
                    app.handleGameOver();
                }
            }
        },

        draw(contextCv) {
            contextCv.save();
            contextCv.beginPath();
            contextCv.arc(this.congA.x, this.congA.y, this.congA.radius, 0, Math.PI * 2);
            contextCv.shadowColor = this.congA.color;
            contextCv.shadowBlur = 20;
            contextCv.lineWidth = 5;
            contextCv.strokeStyle = this.congA.color;
            contextCv.stroke();
            contextCv.restore();

            contextCv.save();
            contextCv.beginPath();
            contextCv.arc(this.congB.x, this.congB.y, this.congB.radius, 0, Math.PI * 2);
            contextCv.shadowColor = this.congB.color;
            contextCv.shadowBlur = this.congB.isDeactivated ? 40 : 20;
            contextCv.lineWidth = 5;
            contextCv.strokeStyle = this.congB.color;
            contextCv.stroke();

            if(this.congB.isDeactivated) {
                contextCv.strokeStyle = '#00ff66';
            }

            contextCv.restore();
        },

        checkWin(app) {
            return this.readyToWin;
        },

        aura_text: `Qua màn 4: Nhiễu Mộng (Mương Ảo)`
    },
    {
        level: 5,
        missionText: "Cảnh báo: Phong ấn cổng Hiện Thực trước khi nó nuốt chửng mọi thứ!",
        congA: null,
        congB: null,
        hasEnteredA: false,
        isWin: false,
        readyToWin: false,
        winTimer: 0,

        init(app) {
            this.hasEnteredA = false;
            this.isWin = false;
            this.readyToWin = false;
            this.winTimer = 0;

            this.congA = {
                x: 100,
                y: 100,
                radius: 15,
                color: '#e4fe21'
            };

            this.congB = {
                x: app.elements.tuong.width - 100,
                y: 100,
                radius: 30,
                color: '#ff000d',
                isDeactivated: false,
                growthSpeed: 0.08
            };
        },

        update(app) {
            const { ball, paddle } = app;
            // đếm thời gian
            if(this.isWin && !this.readyToWin) {
                this.winTimer++;
                ball.dx = 0;
                ball.dy = 0;
                if(this.winTimer >= 180) {
                    this.readyToWin = true;
                }
                return;
            }

            if(this.readyToWin) return;

            this.congB.radius += this.congB.growthSpeed;

            const distAB = khoangCachTamHaiDuongTron(this.congA, this.congB);

            const nuotA = this.congB.radius >= distAB;

            const chamBeDo = (this.congB.y + this.congB.radius) >= paddle.y;

            if(nuotA || chamBeDo) {
                app.handleGameOver();
                return;
            }

            // Va chạm cổng A           
            if(hasCollision(ball, this.congA)) {
                if(!this.hasEnteredA) {
                    this.hasEnteredA = true;

                    ball.dy = -Math.abs(ball.dy);
                    ball.dx = Math.abs(ball.speed);
                }
            }
            // Đi qua cổng B
            if(hasCollision(ball, this.congB)) {
                if(this.hasEnteredA) {
                    this.congB.color = '#00ff66';
                    this.congB.isDeactivated = true;
                    this.isWin = true;

                    app.states.score += 30;
                    if(app.elements.diem) {
                        app.elements.diem.textContent = app.states.score;
                    }
                }
                    else {
                    app.handleGameOver();
                }
            }
        },

        draw(contextCv) {
            contextCv.save();
            contextCv.beginPath();
            contextCv.arc(this.congA.x, this.congA.y, this.congA.radius, 0, Math.PI * 2);
            contextCv.shadowColor = this.congA.color;
            contextCv.shadowBlur = 20;
            contextCv.lineWidth = 5;
            contextCv.strokeStyle = this.congA.color;
            contextCv.stroke();
            contextCv.restore();

            contextCv.save();
            contextCv.beginPath();
            contextCv.arc(this.congB.x, this.congB.y, this.congB.radius, 0, Math.PI * 2);
            contextCv.shadowColor = this.congB.color;
            contextCv.shadowBlur = this.congB.isDeactivated ? 40 : 20;
            contextCv.lineWidth = 5;
            contextCv.strokeStyle = this.congB.color;
            contextCv.stroke();

            if(this.congB.isDeactivated) {
                contextCv.strokeStyle = '#00ff66';
            }

            contextCv.restore();
        },

        checkWin(app) {
            return this.readyToWin;
        },

        aura_text: `Qua màn 5: Cuồng Phong (Bão Giáp)`
    },
    {
        level: 6,
        missionText: "Màn cuối: Làm sao để đạt 150 điểm?",

        isWin: false,
        balls: [],
        isMirrorActive: false,
        tachBong: false,
        targetScore: 150,
        scoreGained: 0,

        init(app) {
            const { ball, paddle } = app;

            this.isWin = false;
            this.isMirrorActive = false;
            this.tachBong = false;
            this.scoreGained = 0;

            if (ball) {
                ball.x = paddle.x + paddle.width / 2;
                ball.y = app.elements.tuong.height - 50;
                ball.dx = 3.5;
                ball.dy = -4;
            }

            this.balls = [ball];

            paddle.isMirrorActive = false;
        },

        update(app) {
            const { paddle } = app;

            if(!this.tachBong && this.balls.length > 0 && this.balls[0].y < app.elements.tuong.height / 2) {
                this.tachBong = true;
                const b = this.balls[0];

                // bóng tp
                this.balls = [
                    b,
                    {
                        x: b.x,
                        y: b.y,
                        dx: 3.5,
                        dy: -4,
                        radius: b.radius || 8,
                        color: '#ffea00'
                    },
                    {
                        x: b.x,
                        y: b.y,
                        dx: -3.5,
                        dy: -4,
                        radius: b.radius || 8,
                        color: '#ffea00'
                    },
                ];
            }
            // có ít nhất 1 bóng nằm ở nửa trên
            this.isMirrorActive = this.balls.some(b => b && b.y < app.elements.tuong.height / 2);
            // xử lý chuyển động của thanh đỡ
            paddle.isMirrorActive = this.isMirrorActive;

            // update cho bóng tp
            for (let index = 0; index < this.balls.length; index++) {
                const b = this.balls[index];

                if(index > 0) {
                    b.x += b.dx;
                    b.y += b.dy;

                    // va chạm
                    if(b.x - b.radius <= 0) {
                        b.x = b.radius;
                        b.dx = Math.abs(b.dx);
                    } else if(b.x + b.radius >= app.elements.tuong.width) {
                        b.x = app.elements.tuong.width - b.radius;
                        b.dx = -Math.abs(b.dx);
                    }

                    if (b.y - b.radius <= 0) {
                        b.y = b.radius;
                        b.dy = Math.abs(b.dy);
                    }
                }

                if(vaChamTheoTam(b, paddle)) {
                    b.dy = -Math.abs(b.dy);

                    this.scoreGained += 10;
                    app.states.score += 10;
                    if (app.elements.diem) {
                        app.elements.diem.textContent = app.states.score;
                    }

                    if(this.scoreGained >= this.targetScore) {
                        this.isWin = true;
                    }
                }

                if(b.y - b.radius > app.elements.tuong.height) {
                    if(!this.isWin) {
                        app.handleGameOver();
                        return;
                    }
                }
            }
        },

        draw(contextCv) {
            const width = contextCv.canvas.width;
            const height = contextCv.canvas.height;
            contextCv.save();
            contextCv.beginPath();
            contextCv.moveTo(0, height / 2);
            contextCv.lineTo(width, height / 2);
            contextCv.setLineDash([8, 8]);
            contextCv.lineWidth = 2;
            contextCv.strokeStyle = this.isMirrorActive ? '#ff0055' : 'rgba(255, 255, 255, 0.3)';
            contextCv.stroke();
            contextCv.restore();

            const bongThem = this.balls.slice(1);

            bongThem.forEach(b => {
                contextCv.save();
                contextCv.beginPath();
                contextCv.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                contextCv.fillStyle = b.color;
                contextCv.shadowColor = b.color;
                contextCv.shadowBlur = 10;
                contextCv.fill();
                contextCv.restore();
            });
        },

        checkWin(app) {
            return this.isWin;
        },

        aura_text: `Hoàn thành màn 6: Kính Hoa Thủy Nguyệt (Thế Giới Gương)`
        }
];

// app chính
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
        levelValue: document.getElementById('level-value'),
        khung: document.querySelector('.canvas-wrapper')
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
        // cập nhật
        this.capNhatNutSkip();

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
        // cập nhật
        this.capNhatNutSkip();
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

            // cộng điểm riêng
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
        // cập nhật
        this.capNhatNutSkip();

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

    taoNutSkip() {
        const khung = this.elements.khung;

        const skipBtn = document.createElement('button');
        skipBtn.id = 'skip-btn';
        skipBtn.textContent = 'Qua màn >';
        Object.assign(skipBtn.style, {
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: '999',
            padding: '8px 12px',
            backgroundColor: '#ff0055',
            color: '#fff',
            fontSize: '1.4rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            display: 'none',
            transition: 'all 0.2s ease'
        });

        skipBtn.addEventListener('click', () => {
            const { gameState, level } = this.states;
            if(gameState !== 'playing' && gameState !== 'levelcomplete') return;
            if(level >= levels.length) return;

            this.nextLevel();
        });

        khung.appendChild(skipBtn);
        this.elements.skipBtn = skipBtn;
    },

    capNhatNutSkip() {
        const skipBtn = this.elements.skipBtn;
        const { gameState, level } = this.states;
        if(gameState === 'playing' || gameState === 'levelcomplete') {
            skipBtn.style.display = 'block';
        } else {
            skipBtn.style.display = 'none';
            return;
        }
        
        // xử lý css
        if (level >= levels.length) {
            skipBtn.disabled = true;
            skipBtn.style.opacity = '0.4';
            skipBtn.style.cursor = 'not-allowed';
            skipBtn.style.userSelect = 'none';
        } else {
            skipBtn.disabled = false;
            skipBtn.style.opacity = '1';
            skipBtn.style.cursor = 'pointer';
            skipBtn.style.userSelect = 'auto';
        }
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

        this.taoNutSkip();
        this.capNhatNutSkip();
    }
};

app.start();