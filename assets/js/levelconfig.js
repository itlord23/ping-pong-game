// import { hasCollisionObject } from "./utils.js";

// export const levels = [
//     {
//         level: 1,
//         missionText: 'Nhiệm vụ: Giữ bóng nảy cho đến khi đạt 100 điểm',
//         init(app) {

//         },

//         onPaddleHit(app) {
//             app.states.score += 10;
//             if (app.elements.diem) {
//                 app.elements.diem.textContent = app.states.score;
//             }
//         },
        
//         update(app) {
            
//         },

//         draw(contextCv) {

//         },

//         checkWin(app) {
//             return app.states.score >= 100;
//         },
//         aura_text: `Qua màn 1: Sơ Tâm (Tịnh giới)`
//     },
//     {
//         level: 2,
//         missionText: 'Nhiệm vụ: Phá bức tường gạch và hứng quả táo',
//         gach: [],
//         apple: null,
//         appleCollected: false,

//         init(app) {
//             this.appleCollected = false;
//             this.gach = [];
//             this.apple = null;
//             const rows = 3;
//             const cols = 3;
//             const brickW = 80;
//             const brickH = 25;
//             const padding = 15;
//             const offsetTop = 70;

//             const totalGridWidth = cols * brickW + (cols - 1) * padding;
//             const offsetLeft = (app.elements.tuong.width - totalGridWidth) / 2;
//             for (let r = 0; r < rows; r++) {
//                 for (let c = 0; c < cols; c++) {
//                     const brickX = offsetLeft + c * (brickW + padding);
//                     const brickY = offsetTop + r * (brickH + padding);

//                     const isAppleBrick = (r === 0 && c === 1);

//                     this.gach.push({
//                         row: r,
//                         col: c,
//                         x: brickX,
//                         y: brickY,
//                         width: brickW,
//                         height: brickH,
//                         alive: true,
//                         hasApple: isAppleBrick
//                     });
//                 }
//             }
//         },

//         update(app) {
//             const { ball, paddle } = app;
//             // xử lý va chạm giữa bóng và gạch, cộng điểm
//             this.gach.forEach(g => {
//                 if(g.alive) {
//                     if(hasCollisionObject(ball, g)) {
//                         g.alive = false;

//                         ball.dy = -ball.dy;

//                         app.states.score += 10;

//                         if(app.elements.diem) {
//                             app.elements.diem.textContent = app.states.score;
//                         }

//                         // nếu mà chạm trúng gạch có quả táo
//                         if(g.hasApple) {
//                             this.apple = {
//                                 x: g.x + g.width / 2,
//                                 y: g.y + g.height,
//                                 radius: 12,
//                                 speed: 3.5 // tốc độ rơi
//                             }
//                         }
//                     }
//                  }
//             });

//             if(this.apple) {
//                 this.apple.y += this.apple.speed;

//                 const hitX = this.apple.x >= paddle.x && 
//                             this.apple.x <= paddle.x + paddle.width;
//                 const hitY = this.apple.y + this.apple.radius >= paddle.y &&
//                             this.apple.y - this.apple.radius <= paddle.y + paddle.height;

//                 if(hitX && hitY) {
//                     this.appleCollected = true;
//                     this.apple = null;
//                 } else if(this.apple && this.apple.y - this.apple.radius > app.elements.tuong.height) {
//                     this.apple = null;
//                     app.handleGameOver();
//                     return;
//                 }
//             }
//         },

//         draw(contextCv) {
//             this.gach.forEach(g => {
//                 if(g.alive) {
//                     contextCv.fillStyle = g.hasApple ? '#ff0055' : '#00f3ff';
//                     contextCv.fillRect(g.x, g.y, g.width, g.height);

//                     // vẽ thêm viền
//                     contextCv.strokeStyle = '#fff';
//                     contextCv.lineWidth = 1.5;
//                     contextCv.strokeRect(g.x, g.y, g.width, g.height);
//                 }
//             });
//             // vẽ quả táo đang rơi
//             if(this.apple) {
//                 contextCv.beginPath();
//                 contextCv.arc(this.apple.x, this.apple.y, this.apple.radius, 0, Math.PI * 2);
//                 contextCv.fillStyle = '#ff2a2a';
//                 contextCv.fill();
//                 contextCv.closePath();

//                 contextCv.beginPath();
//                 contextCv.fillStyle = '#5c3a21';
//                 contextCv.fillRect(this.apple.x - 1, this.apple.y - this.apple.radius - 4, 2, 5);
//                 contextCv.closePath();

//                 contextCv.beginPath();
//                 contextCv.arc(this.apple.x + 3, this.apple.y - this.apple.radius - 2, 3, 0, Math.PI * 2);
//                 contextCv.fillStyle = '#22cc44';
//                 contextCv.fill();
//                 contextCv.closePath();
//             }
//         },

//         checkWin(app) {
//             return this.appleCollected;
//         },
//         aura_text: `Qua màn 2: Phá lãng (Sóng cuộn)`
//     },
//     {
//         level: 3,
//         missionText: 'Nhiệm vụ: Hạ gục con boss trước khi nó giết bạn!',
//         boss: null,
//         bullets: [],
//         lastShotTime: 0,
//         shootInterval: 90,
//         init(app) {
//             this.bullets = [];
//             this.boss = {
//                 x: app.elements.tuong.width / 2 - 45,
//                 y: 40,
//                 width: 80,
//                 height: 35,
//                 speedX: 4.5,
//                 hp: 5,
//                 maxHp: 5
//             }
//         },

//         update(app) {
//             const { ball, paddle } = app;
//             if(!this.boss || this.boss.hp <= 0) return;
//             // di chuyển của boss
//             this.boss.x += this.boss.speedX;
//             if(this.boss.x <= 0 || this.boss.x + this.boss.width >= app.elements.tuong.width) {
//                 this.boss.speedX *= -1; // đảo chiều
//             }

//             if(hasCollisionObject(ball, this.boss)) {
//                 ball.dy = -ball.dy;
//                 ball.y = this.boss.y + this.boss.height + ball.radius;
//                 this.boss.hp -= 1;

//                 app.states.score += 20;

//                 if(app.elements.diem) {
//                     app.elements.diem.textContent = app.states.score;
//                 }
//             }

//             // boss bắn đạn xuống
//             this.lastShotTime++;
//             if(this.lastShotTime >= this.shootInterval) {
//                 this.lastShotTime = 0;
//                 this.bullets.push({
//                     x: this.boss.x + (this.boss.width / 2) - 3,
//                     y: this.boss.y + this.boss.height,
//                     width: 6,
//                     height: 15,
//                     speedY: 4
//                 });
//             }

//             // xử lý đan va chạm với bệ đỡ
//             for (let index = this.bullets.length - 1; index >= 0; index--) {
//                 const element = this.bullets[index];
//                 element.y += element.speedY;

//                 const hitPaddleX = element.x + element.width >= paddle.x && 
//                                element.x <= paddle.x + paddle.width;
//                 const hitPaddleY = element.y + element.height >= paddle.y && 
//                                element.y <= paddle.y + paddle.height;

//                 if (hitPaddleX && hitPaddleY) {
//                     app.handleGameOver();
//                     return;
//                 }

//                 if (element.y > app.elements.tuong.height) {
//                     this.bullets.splice(index, 1);
//                 }
//             }
//         },

//         draw(contextCv) {
//             if (!this.boss || this.boss.hp <= 0) return;

//             contextCv.fillStyle = '#ff0055';
//             contextCv.fillRect(this.boss.x, this.boss.y, this.boss.width, this.boss.height);
//             contextCv.strokeStyle = '#ffffff';
//             contextCv.lineWidth = 2;
//             contextCv.strokeRect(this.boss.x, this.boss.y, this.boss.width, this.boss.height);

//             const hpBarW = this.boss.width;
//             const hpRatio = this.boss.hp / this.boss.maxHp;

//             contextCv.fillStyle = 'rgba(0, 0, 0, 0.42)';
//             contextCv.fillRect(this.boss.x, this.boss.y - 12, hpBarW, 6);

//             contextCv.fillStyle = hpRatio > 0.4 ? '#00ff66' : '#ff2200';
//             contextCv.fillRect(this.boss.x, this.boss.y - 12, hpBarW * hpRatio, 6);

//             // vẽ đạn
//             contextCv.fillStyle = '#ffea00';
//             this.bullets.forEach(b => {
//                 contextCv.fillRect(b.x, b.y, b.width, b.height);
//                 contextCv.strokeStyle = '#ff2200';
//                 contextCv.lineWidth = 1;
//                 contextCv.strokeRect(b.x, b.y, b.width, b.height);
//             });
//         },

//         checkWin(app) {
//             return this.boss && this.boss.hp <= 0;
//         },
//         aura_text: `Qua màn 3: Lôi Động (Sấm sét)`
//     },
//     {
//         level: 4,
//         missionText: "Nhiệm vụ: Vô hiệu hóa cánh cổng đỏ kết nối với thế giới Hiện Thực chỉ khi đi qua cánh cổng vàng của Xi Wang",
//         congA: null,
//         congB: null,
//         hasEnteredA: false,
//         isWin: false,
//         readyToWin: false,
//         winTimer: 0,
//         timerA: 600,
//         isAExpired: false,

//         init(app) {
//             this.hasEnteredA = false;
//             this.isWin = false;
//             this.readyToWin = false;
//             this.winTimer = 0;

//             this.congA = {
//                 x: 100,
//                 y: 100,
//                 radius: 15,
//                 color: '#e4fe21'
//             };

//             this.congB = {
//                 x: app.elements.tuong.width - 100,
//                 y: 100,
//                 radius: 30,
//                 color: '#ff000d',
//                 isDeactivated: false
//             };
//         },

//         update(app) {
//             const { ball } = app;
//             // đếm thời gian
//             if(this.isWin && !this.readyToWin) {
//                 this.winTimer++;
//                 ball.dx = 0;
//                 ball.dy = 0;
//                 if(this.winTimer >= 180) {
//                     this.readyToWin = true;
//                 }
//                 return;
//             }

//             if(this.readyToWin) return;

//             // Va chạm cổng A           
//             if(this.hasCollision(ball, this.congA)) {
//                 if(!this.hasEnteredA) {
//                     this.hasEnteredA = true;

//                     ball.dy = -Math.abs(ball.dy);
//                     ball.dx = Math.abs(ball.speed);
//                 }
//             }
//             // Đi qua cổng B
//             if(this.hasCollision(ball, this.congB)) {
//                 if(this.hasEnteredA) {
//                     this.congB.color = '#00ff66';
//                     this.congB.isDeactivated = true;
//                     this.isWin = true;

//                     app.states.score += 30;
//                     if(app.elements.diem) {
//                         app.elements.diem.textContent = app.states.score;
//                     }
//                 }
//                  else {
//                     app.handleGameOver();
//                 }
//             }
//         },

//         hasCollision(ball, cong) {
//             const dist = Math.sqrt(Math.pow((ball.x-cong.x), 2) + Math.pow((ball.y-cong.y), 2));
//             return dist <= ball.radius + cong.radius;
//         },

//         draw(contextCv) {
//             contextCv.save();
//             contextCv.beginPath();
//             contextCv.arc(this.congA.x, this.congA.y, this.congA.radius, 0, Math.PI * 2);
//             contextCv.shadowColor = this.congA.color;
//             contextCv.shadowBlur = 20;
//             contextCv.lineWidth = 5;
//             contextCv.strokeStyle = this.congA.color;
//             contextCv.stroke();
//             contextCv.restore();

//             contextCv.save();
//             contextCv.beginPath();
//             contextCv.arc(this.congB.x, this.congB.y, this.congB.radius, 0, Math.PI * 2);
//             contextCv.shadowColor = this.congB.color;
//             contextCv.shadowBlur = this.congB.isDeactivated ? 40 : 20;
//             contextCv.lineWidth = 5;
//             contextCv.strokeStyle = this.congB.color;
//             contextCv.stroke();

//             if(this.congB.isDeactivated) {
//                 contextCv.strokeStyle = '#00ff66';
//             }

//             contextCv.restore();
//         },

//         checkWin(app) {
//             return this.readyToWin;
//         },

//         aura_text: `Qua màn 4: Nhiễu Mộng (Mương Ảo)`
//     },
//     {
//         level: 5,
//         missionText: "Cảnh báo: Phong ấn cổng Hiện Thực trước khi nó nuốt chửng mọi thứ!",
//         congA: null,
//         congB: null,
//         hasEnteredA: false,
//         isWin: false,
//         readyToWin: false,
//         winTimer: 0,

//         init(app) {
//             this.hasEnteredA = false;
//             this.isWin = false;
//             this.readyToWin = false;
//             this.winTimer = 0;

//             this.congA = {
//                 x: 100,
//                 y: 100,
//                 radius: 15,
//                 color: '#e4fe21'
//             };

//             this.congB = {
//                 x: app.elements.tuong.width - 100,
//                 y: 100,
//                 radius: 30,
//                 color: '#ff000d',
//                 isDeactivated: false,
//                 growthSpeed: 0.08
//             };
//         },

//         update(app) {
//             const { ball, paddle } = app;
//             // đếm thời gian
//             if(this.isWin && !this.readyToWin) {
//                 this.winTimer++;
//                 ball.dx = 0;
//                 ball.dy = 0;
//                 if(this.winTimer >= 180) {
//                     this.readyToWin = true;
//                 }
//                 return;
//             }

//             if(this.readyToWin) return;

//             this.congB.radius += this.congB.growthSpeed;

//             const distAB = Math.sqrt(Math.pow((this.congA.x-this.congB.x), 2) + Math.pow((this.congA.y-this.congB.y), 2));

//             const nuotA = this.congB.radius >= distAB;

//             const chamBeDo = (this.congB.y + this.congB.radius) >= paddle.y;

//             if(nuotA || chamBeDo) {
//                 app.handleGameOver();
//                 return;
//             }

//             // Va chạm cổng A           
//             if(this.hasCollision(ball, this.congA)) {
//                 if(!this.hasEnteredA) {
//                     this.hasEnteredA = true;

//                     ball.dy = -Math.abs(ball.dy);
//                     ball.dx = Math.abs(ball.speed);
//                 }
//             }
//             // Đi qua cổng B
//             if(this.hasCollision(ball, this.congB)) {
//                 if(this.hasEnteredA) {
//                     this.congB.color = '#00ff66';
//                     this.congB.isDeactivated = true;
//                     this.isWin = true;

//                     app.states.score += 30;
//                     if(app.elements.diem) {
//                         app.elements.diem.textContent = app.states.score;
//                     }
//                 }
//                  else {
//                     app.handleGameOver();
//                 }
//             }
//         },

//         hasCollision(ball, cong) {
//             const dist = Math.sqrt(Math.pow((ball.x-cong.x), 2) + Math.pow((ball.y-cong.y), 2));
//             return dist <= ball.radius + cong.radius;
//         },

//         draw(contextCv) {
//             contextCv.save();
//             contextCv.beginPath();
//             contextCv.arc(this.congA.x, this.congA.y, this.congA.radius, 0, Math.PI * 2);
//             contextCv.shadowColor = this.congA.color;
//             contextCv.shadowBlur = 20;
//             contextCv.lineWidth = 5;
//             contextCv.strokeStyle = this.congA.color;
//             contextCv.stroke();
//             contextCv.restore();

//             contextCv.save();
//             contextCv.beginPath();
//             contextCv.arc(this.congB.x, this.congB.y, this.congB.radius, 0, Math.PI * 2);
//             contextCv.shadowColor = this.congB.color;
//             contextCv.shadowBlur = this.congB.isDeactivated ? 40 : 20;
//             contextCv.lineWidth = 5;
//             contextCv.strokeStyle = this.congB.color;
//             contextCv.stroke();

//             if(this.congB.isDeactivated) {
//                 contextCv.strokeStyle = '#00ff66';
//             }

//             contextCv.restore();
//         },

//         checkWin(app) {
//             return this.readyToWin;
//         },

//         aura_text: `Qua màn 5: Cuồng Phong (Bão Giáp)`
//     },
//     {
//         level: 6,
//         missionText: "Màn cuối: Làm sao để đạt 150 điểm?",

//         isWin: false,
//         balls: [],
//         isMirrorActive: false,
//         tachBong: false,
//         targetScore: 150,
//         scoreGained: 0,

//         init(app) {
//             const { ball, paddle } = app;

//             this.isWin = false;
//             this.isMirrorActive = false;
//             this.tachBong = false;
//             this.scoreGained = 0;

//             if (ball) {
//                 ball.x = paddle.x + paddle.width / 2;
//                 ball.y = app.elements.tuong.height - 50;
//                 ball.dx = 3.5;
//                 ball.dy = -4;
//             }

//             this.balls = [ball];

//             paddle.isMirrorActive = false;
//         },

//         update(app) {
//             const { paddle } = app;

//             if(!this.tachBong && this.balls.length > 0 && this.balls[0].y < app.elements.tuong.height / 2) {
//                 this.tachBong = true;
//                 const b = this.balls[0];

//                 // bóng tp
//                 this.balls = [
//                     b,
//                     {
//                         x: b.x,
//                         y: b.y,
//                         dx: 3.5,
//                         dy: -4,
//                         radius: b.radius || 8,
//                         color: '#ffea00'
//                     },
//                     {
//                         x: b.x,
//                         y: b.y,
//                         dx: -3.5,
//                         dy: -4,
//                         radius: b.radius || 8,
//                         color: '#ffea00'
//                     },
//                 ];
//             }
//             // có ít nhất 1 bóng nằm ở nửa trên
//             this.isMirrorActive = this.balls.some(b => b && b.y < app.elements.tuong.height / 2);
//             // xử lý chuyển động của thanh đỡ
//             paddle.isMirrorActive = this.isMirrorActive;

//             // update cho bóng tp
//             for (let index = 0; index < this.balls.length; index++) {
//                 const b = this.balls[index];

//                 if(index > 0) {
//                     b.x += b.dx;
//                     b.y += b.dy;

//                     // va chạm
//                     if(b.x - b.radius <= 0) {
//                         b.x = b.radius;
//                         b.dx = Math.abs(b.dx);
//                     } else if(b.x + b.radius >= app.elements.tuong.width) {
//                         b.x = app.elements.tuong.width - b.radius;
//                         b.dx = -Math.abs(b.dx);
//                     }

//                     if (b.y - b.radius <= 0) {
//                         b.y = b.radius;
//                         b.dy = Math.abs(b.dy);
//                     }
//                 }
                
//                 const hitPaddleX = b.x >= paddle.x && b.x <= paddle.x + paddle.width;
//                 const hitPaddleY = b.y + b.radius >= paddle.y && b.y - b.radius <= paddle.y + paddle.height;
//                 if(hitPaddleX && hitPaddleY) {
//                     b.dy = -Math.abs(b.dy);

//                     this.scoreGained += 10;
//                     app.states.score += 10;
//                     if (app.elements.diem) {
//                         app.elements.diem.textContent = app.states.score;
//                     }

//                     if(this.scoreGained >= this.targetScore) {
//                         this.isWin = true;
//                     }
//                 }

//                 if(b.y - b.radius > app.elements.tuong.height) {
//                     if(!this.isWin) {
//                         app.handleGameOver();
//                         return;
//                     }
//                 }
//             }
//         },

//         draw(contextCv) {
//             const width = contextCv.canvas.width;
//             const height = contextCv.canvas.height;
//             contextCv.save();
//             contextCv.beginPath();
//             contextCv.moveTo(0, height / 2);
//             contextCv.lineTo(width, height / 2);
//             contextCv.setLineDash([8, 8]);
//             contextCv.lineWidth = 2;
//             contextCv.strokeStyle = this.isMirrorActive ? '#ff0055' : 'rgba(255, 255, 255, 0.3)';
//             contextCv.stroke();
//             contextCv.restore();

//             const bongThem = this.balls.slice(1);

//             bongThem.forEach(b => {
//                 contextCv.save();
//                 contextCv.beginPath();
//                 contextCv.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
//                 contextCv.fillStyle = b.color;
//                 contextCv.shadowColor = b.color;
//                 contextCv.shadowBlur = 10;
//                 contextCv.fill();
//                 contextCv.restore();
//             });
//         },

//         checkWin(app) {
//             return this.isWin;
//         },

//         aura_text: `Hoàn thành màn 6: Kính Hoa Thủy Nguyệt (Thế Giới Gương)`
//         }
// ]