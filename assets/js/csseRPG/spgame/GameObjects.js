import GameEnv from './GameEnv.js';

class GameObject {

    constructor() {
        if (new.target === GameObject) {
            throw new TypeError("Cannot construct GameObject instances directly");
        }
        this.collisionWidth = 0;
        this.collisionHeight = 0;
        this.collisionData = {};
        this.hitbox = {};
        this.state = {
            collisionEvents: [],
            movement: { up: true, down: true, left: true, right: true },
        };
    }


    draw() {
        throw new Error("Method 'draw()' must be implemented.");
    }

    update() {
        throw new Error("Method 'update()' must be implemented.");
    }


    resize() {
        throw new Error("Method 'resize()' must be implemented.");
    }

    destroy() {
        throw new Error("Method 'destroy()' must be implemented.");
    }

    collisionChecks() {
        let collisionDetected = false;

        for (var gameObj of GameEnv.gameObjects) {
            if (gameObj.canvas && this != gameObj) {
                this.isCollision(gameObj);
                if (this.collisionData.hit) {
                    collisionDetected = true;
                    this.handleCollisionEvent();
                }
            }
        }

        if (!collisionDetected) {
            this.state.collisionEvents = [];
        }
    }

    isCollision(other) {
        // Bounding rectangles from Canvas
        const thisRect = this.canvas.getBoundingClientRect();
        const otherRect = other.canvas.getBoundingClientRect();

        // Calculate hitbox constants for this object
        const thisWidthReduction = thisRect.width * (this.hitbox?.widthPercentage || 0.0);
        const thisHeightReduction = thisRect.height * (this.hitbox?.heightPercentage || 0.0);

        // Calculate hitbox constants for other object
        const otherWidthReduction = otherRect.width * (other.hitbox?.widthPercentage || 0.0);
        const otherHeightReduction = otherRect.height * (other.hitbox?.heightPercentage || 0.0);

        // Build hitbox by subtracting reductions from the left, right, and top
        const thisLeft = thisRect.left + thisWidthReduction;
        const thisTop = thisRect.top + thisHeightReduction;
        const thisRight = thisRect.right - thisWidthReduction;
        const thisBottom = thisRect.bottom;

        const otherLeft = otherRect.left + otherWidthReduction;
        const otherTop = otherRect.top + otherHeightReduction;
        const otherRight = otherRect.right - otherWidthReduction;
        const otherBottom = otherRect.bottom;

        // Determine hit and touch points of hit
        const hit = (
            thisLeft < otherRight &&
            thisRight > otherLeft &&
            thisTop < otherBottom &&
            thisBottom > otherTop
        );

        const touchPoints = {
            this: {
                id: this.canvas.id,
                greet: this.spriteData.greeting,
                top: thisBottom > otherTop && thisTop < otherTop,
                bottom: thisTop < otherBottom && thisBottom > otherBottom,
                left: thisRight > otherLeft && thisLeft < otherLeft,
                right: thisLeft < otherRight && thisRight > otherRight,
            },
            other: {
                id: other.canvas.id,
                greet: other.spriteData.greeting,
                top: otherBottom > thisTop && otherTop < thisTop,
                bottom: otherTop < thisBottom && otherBottom > thisBottom,
                left: otherRight > thisLeft && otherLeft < thisLeft,
                right: otherLeft < thisRight && otherRight > thisRight,
            },
        };

        this.collisionData = { hit, touchPoints };
    }

    handleCollisionEvent() {
        const objectOther = this.collisionData.touchPoints.other;
        // check if the collision type is not already in the collisions array
        if (!this.state.collisionEvents.includes(objectOther.id)) {
            // add the collisionType to the collisions array, making it the current collision
            this.state.collisionEvents.push(objectOther.id);
            this.handleCollisionReaction(objectOther);
        }
        this.handleCollisionState();
    }

    handleCollisionReaction(other) {
        alert(other.greet);
    }

    handleCollisionState() {
        // handle player reaction based on collision type
        if (this.state.collisionEvents.length > 0) {
            const touchPoints = this.collisionData.touchPoints.this;

            // Reset movement to allow all directions initially
            this.state.movement = { up: true, down: true, left: true, right: true };

            if (touchPoints.top) {
                this.state.movement.down = false;
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                }
            }

            if (touchPoints.bottom) {
                this.state.movement.up = false;
                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                }
            }

            if (touchPoints.right) {
                this.state.movement.left = false;
                if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                }
            }

            if (touchPoints.left) {
                this.state.movement.right = false;
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;
                }
            }
        }

        // Add world boundary checks
        if (this.canvas && typeof this.x === 'number' && typeof this.y === 'number') {
            const padding = 50;
            const spriteWidth = this.canvas.width / 2;  // Use half width for better boundary fit
            const spriteHeight = this.canvas.height / 2;  // Use half height for better boundary fit

            // Left boundary
            if (this.x < padding) {
                this.x = padding;
                this.state.movement.left = false;
                if (this.velocity) this.velocity.x = 0;
            }

            // Right boundary
            if (this.x > GameEnv.innerWidth - spriteWidth - padding) {
                this.x = GameEnv.innerWidth - spriteWidth - padding;
                this.state.movement.right = false;
                if (this.velocity) this.velocity.x = 0;
            }

            // Top boundary
            if (this.y < padding) {
                this.y = padding;
                this.state.movement.up = false;
                if (this.velocity) this.velocity.y = 0;
            }

            // Bottom boundary
            if (this.y > GameEnv.innerHeight - spriteHeight - padding) {
                this.y = GameEnv.innerHeight - spriteHeight - padding;
                this.state.movement.down = false;
                if (this.velocity) this.velocity.y = 0;
            }

            // Update position
            this.canvas.style.transform = `translate(${this.x}px, ${this.y}px)`;
        }
    }
}

export default GameObject;