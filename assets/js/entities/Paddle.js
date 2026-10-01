export const paddle = {
    x: 450,
    y: 450,
    width: 100,
    height: 15,
    speed: 8,
    dx: 0,

    reset(width) {
        // cho nằm giữa
        this.x = (width - this.width) / 2;
        this.dx = 0;
    },
    
    update(width) {
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
        if(e.key === 'ArrowLeft' || e.key === 'a') paddle.dx = -paddle.speed;
        if(e.key === 'ArrowRight' || e.key === 'd') paddle.dx = paddle.speed;
    },

    handleKeyUp(e) {
        if (
            e.key === 'ArrowLeft' ||
            e.key === 'a' ||
            e.key === 'ArrowRight' ||
            e.key === 'd'
        ) {
            this.dx = 0;
        }
    }
}