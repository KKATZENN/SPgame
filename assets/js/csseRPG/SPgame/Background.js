import GameEnv from './SPgame/GameEnv.js';
import GameObject from './SPgame/GameObjects.js';

export class Background extends GameObject {
    constructor(data = null) {
        super();
        if (data.src) {
            this.image = new Image();
            this.image.src = data.src;
        } else {
            this.image = null;
        }
        GameEnv.gameObjects.push(this);
    }

    draw() {
        const ctx = GameEnv.ctx;
        const width = GameEnv.innerWidth;
        const height = GameEnv.innerHeight;

        if (this.image) {
            // Draw the background image scaled to the canvas size
            ctx.drawImage(this.image, 0, 0, width, height);
        } else {
            // Fill the canvas with fillstyle color if no image is provided
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, width, height);
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