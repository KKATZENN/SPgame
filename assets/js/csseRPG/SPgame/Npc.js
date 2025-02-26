import Character from "./Character.js";

import Character from "./Character.js";

class NPC extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.velocity = { x: 1, y: 1 }; // Bobby's movement speed
    }

    update() {
        this.draw();
        this.move();
    }

    // Bobby moves around the screen by bouncing off walls
    move() {
        // Update NPC's position based on his velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Bounce NPC off the walls
        if (this.position.x + this.width > this.gameEnv.innerWidth || this.position.x < 0) {
            this.velocity.x = -this.velocity.x; // Reverse direction horizontally
        }

        if (this.position.y + this.height > this.gameEnv.innerHeight || this.position.y < 0) {
            this.velocity.y = -this.velocity.y; // Reverse direction vertically
        }
    }
}

export default NPC;
