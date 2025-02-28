import GameEnv from './GameEnv.js';
import GameObject from './GameObjects.js';

export class Background extends GameObject {
    constructor(data = null) {
        super();
        if (data.src) {
            this.image = new Image();
            this.image.src = data.src;
            this.pixels = data.pixels; // Store the pixel dimensions
        } else {
            this.image = null;
        }
        GameEnv.gameObjects.push(this);
    }

    draw() {
        const ctx = GameEnv.ctx;

        if (this.image) {
            // Draw the background at exact dimensions
            ctx.drawImage(this.image, 0, 0, 2076, 1160);
        } else {
            // Fill the canvas with fillstyle color if no image is provided
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, 2076, 1160);
        }
    }

    update() {
        this.draw();
    }

    resize() {
        this.draw();
    }

    destroy() {
        const index = GameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            GameEnv.gameObjects.splice(index, 1);
        }
    }
}

export default Background;