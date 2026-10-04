export const levels = [
    {
        level: 1,
        missionText: 'Nhiệm vụ: Giữ bóng nảy cho đến khi đạt 100 điểm',
        init(app) {

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
        tao: null,
        appleCollected: false,

        init(app) {
            this.appleCollected = false;
            this.gach = [];
            this.tao = null;
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

        },

        draw(contextCv) {
            this.gach.forEach(g => {
                if(g.alive) {
                    contextCv.fillStyle = g.hasApple ? '#ff0055' : '#00f3ff';
                    contextCv.fillRect(g.x, g.y, g.width, g.height);
                }
            });
        },

        checkWin(app) {
            return this.appleCollected;
        },
        aura_text: `Anh Long, Anh Long! Qua màn 2`
    }
]