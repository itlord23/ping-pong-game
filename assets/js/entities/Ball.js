export const ball = {
    x: 0,
    y: 0,
    radius: 8,
    speed: 5,
    dx: 8,
    dy: 0,

    reset(width, height) {

    },
    
    update(width, height) {
        this.x += this.dx;
        this.y += this.dy;

        if(this.x - this.radius <= 0 || this.x + this.radius >= width) {
            this.dx = -this.dx;

        }

        if(this.y - this.radius <= 0) {
            this.dy = -this.dy;
            this.y = this.radius;
        }
    },

    draw(contextCv) {
        contextCv.fillStyle = "#fff"
        contextCv.fill();
    },
}

