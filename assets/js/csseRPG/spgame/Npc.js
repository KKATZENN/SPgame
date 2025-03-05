import Character from "./Character.js";
import GameEnv from './GameEnv.js';


class NPC extends Character {
    constructor(data = null) {
        super(data);
        // Initialize velocity for Bobby and Paul
        if (data.id === 'Bobby') {
            this.velocity = { x: 1, y: 1 }; // Bobby's movement speed
        } else if (data.id === 'Randy') {
            this.velocity = { x: 0, y: 0 }; // Paul's initial velocity
            this.speed = 3; // Paul's movement speed
            // Add event listeners for WASD keys
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            document.addEventListener('keyup', this.handleKeyUp.bind(this));
            this.keys = { w: false, a: false, s: false, d: false };
        } else {
            this.velocity = { x: 0, y: 0 }; // Other NPCs don't move
        }
    }

    handleKeyDown(event) {
        if (this.spriteData.id !== 'Randy') return;
        
        switch (event.key.toLowerCase()) {
            case 'w':
                this.keys.w = true;
                break;
            case 'a':
                this.keys.a = true;
                break;
            case 's':
                this.keys.s = true;
                break;
            case 'd':
                this.keys.d = true;
                break;
        }
    }

    handleKeyUp(event) {
        if (this.spriteData.id !== 'Randy') return;
        
        switch (event.key.toLowerCase()) {
            case 'w':
                this.keys.w = false;
                break;
            case 'a':
                this.keys.a = false;
                break;
            case 's':
                this.keys.s = false;
                break;
            case 'd':
                this.keys.d = false;
                break;
        }
    }

    update() {
        this.draw();
        if (this.spriteData.id === 'Bobby') {
            this.move();
        } else if (this.spriteData.id === 'Randy') {
            this.movePlayer();
        }
    }

    movePlayer() {
        // Reset velocity
        this.velocity.x = 0;
        this.velocity.y = 0;

        // Update velocity and direction based on keys pressed
        if (this.keys.w) {
            this.velocity.y = -this.speed;
            this.direction = 'up';
        }
        if (this.keys.s) {
            this.velocity.y = this.speed;
            this.direction = 'down';
        }
        if (this.keys.a) {
            this.velocity.x = -this.speed;
            this.direction = 'left';
        }
        if (this.keys.d) {
            this.velocity.x = this.speed;
            this.direction = 'right';
        }

        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Keep Player within bounds
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > GameEnv.innerWidth) this.position.x = GameEnv.innerWidth - this.width;
        if (this.position.y < 0) this.position.y = 0;
        if (this.position.y + this.height > GameEnv.innerHeight) this.position.y = GameEnv.innerHeight - this.height;

        // Update animation frame
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.frameCounter++;
            if (this.frameCounter >= this.animationRate) {
                this.frameCounter = 0;
                this.frameIndex = (this.frameIndex + 1) % 3; // 3 frames per direction
            }
        }
    }

    // Bobby moves around the screen by bouncing off walls
    move() {
        // Update NPC's position based on his velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Bounce NPC off the walls
        if (this.position.x + this.width > GameEnv.innerWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x; // Reverse direction horizontally
        }

        if (this.position.y + this.height > GameEnv.innerHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y; // Reverse direction vertically
        }
    }
}

export default NPC;
