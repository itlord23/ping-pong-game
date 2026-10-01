export const ball = {
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

        if(this.x - this.radius <= 0 || this.x + this.radius >= width) {
            this.dx = -this.dx;

            if(this.x - this.radius <= 0) {
                this.x = this.radius;
            }
            if(this.x + this.radius >= width) {
                this.x = width - this.radius;
            }
        }

        if(this.y - this.radius <= 0) {
            this.dy = -this.dy;
            this.y = this.radius;
        }
    },

    draw(contextCv) {
        contextCv.beginPath();
        contextCv.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        contextCv.fillStyle = "#fff";
        contextCv.fill();
        contextCv.closePath();
    },
}

