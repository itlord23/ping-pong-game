export const paddle = {
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
        if(moveLeft & !moveRight) {
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
}