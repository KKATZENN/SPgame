import GameEnv from './GameEnv.js';
import GameObject from './GameObjects.js';

const SCALE_FACTOR = 10; // 1/nth of the height of the canvas
const STEP_FACTOR = 100; // 1/nth, or N steps up and across the canvas
const ANIMATION_RATE = 1; // 1/nth of the frame rate
const INIT_POSITION = { x: 0, y: 0 };

class Character extends GameObject {

    constructor(data = null) {
        super();
        
        // Ensure data is not null
        if (!data) {
            throw new Error('Data is required for Character');
        }

        this.state = {
            ...this.state,
            animation: 'idle',
            direction: 'right',
            isDying: false,
            isFinishing: false,
        }; // Object control data

        // Create canvas element
        this.canvas = document.createElement("canvas");
        this.canvas.id = data.id || "default";
        this.canvas.width = data.pixels?.width || 0;
        this.canvas.height = data.pixels?.height || 0;
        this.hitbox = data?.hitbox || {};
        this.ctx = this.canvas.getContext('2d');
        document.getElementById("gameContainer").appendChild(this.canvas);

        // Set tagger state after canvas is created
        this.state.isTagger = this.canvas.id === "player";

        // Set initial object properties 
        this.x = data.INIT_POSITION?.x || 0;
        this.y = data.INIT_POSITION?.y || 0;
        this.frame = 0;
        
        // Initialize the object's scale based on the game environment
        this.scale = { width: GameEnv.innerWidth, height: GameEnv.innerHeight };
        
        // Check if sprite data is provided
        if (data.src) {
            this.scaleFactor = data.SCALE_FACTOR || SCALE_FACTOR;
            this.stepFactor = data.STEP_FACTOR || STEP_FACTOR;
            this.animationRate = data.ANIMATION_RATE || ANIMATION_RATE;
            this.position = {
                x: this.x,
                y: this.y
            };
    
            // Load the sprite sheet
            this.spriteSheet = new Image();
            this.spriteSheet.src = data.src;
            this.spriteSheet.onerror = () => {
                console.error('Failed to load sprite sheet:', data.src);
                this.spriteSheet = null;
            };

            // Initialize animation properties
            this.frameIndex = 0; // index reference to current frame
            this.frameCounter = 0; // count each frame rate refresh
            this.direction = 'down'; // Initial direction
            this.spriteData = {
                ...data,
                orientation: data.orientation || { rows: 1, columns: 1 },
                pixels: data.pixels || { width: 32, height: 32 }
            };
        } else {
            throw new Error('Sprite source (src) is required');
        }

        // Initialize the object's position and velocity
        this.velocity = { x: 0, y: 0 };

        // Add this object to the gameLoop
        GameEnv.gameObjects.push(this);

        // Set the initial size and velocity of the object
        this.resize();

    }

    draw() {
        if (!this.canvas || !this.ctx) return;

        // Clear the canvas before drawing
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.spriteSheet && this.spriteSheet.complete && this.spriteSheet.naturalHeight !== 0) {
            try {
                // Get sprite orientation data with safe defaults
                const orientation = this.spriteData?.orientation || { rows: 1, columns: 1 };
                const pixels = this.spriteData?.pixels || { width: 32, height: 32 };
                
                // Calculate frame dimensions
                const frameWidth = Math.floor(pixels.width / orientation.columns);
                const frameHeight = Math.floor(pixels.height / orientation.rows);
    
                // For NPCs that don't have direction-specific sprite data
                let frameX = 0;
                let frameY = 0;

                // Special handling for different characters
                let actualFrameWidth = frameWidth;
                let sourceFrameWidth = frameWidth;
                let sourceFrameHeight = frameHeight;
                if (this.canvas.id === "Bobby") {
                    actualFrameWidth = Math.floor(frameWidth / 3);
                    sourceFrameWidth = actualFrameWidth;
                } else if (this.canvas.id === "Referee") {
                    // For Referee, use the full sprite height and width
                    sourceFrameWidth = pixels.width;
                    sourceFrameHeight = pixels.height;
                    actualFrameWidth = sourceFrameWidth;
                    frameX = 0;  // Start from the beginning of the sprite sheet
                    frameY = 0;  // No vertical offset
                } else {
                    // For all other characters, use standard frame width
                    actualFrameWidth = frameWidth;
                    sourceFrameWidth = frameWidth;
                }

                // If we have direction-specific data (for Player), use it
                const directionData = this.spriteData?.[this.direction];
                if (directionData && this.canvas.id !== "Referee") {  // Skip for Referee
                    frameX = (directionData.start || 0) * frameWidth;
                    frameY = (directionData.row || 0) * frameHeight;
                } else if (this.canvas.id !== "Referee") {  // Skip for Referee
                    // For NPCs, just use the frame index directly
                    frameX = (this.frameIndex % orientation.columns) * frameWidth;
                    frameY = Math.floor(this.frameIndex / orientation.columns) * frameHeight;
                }
    
                // Set up the canvas dimensions to match the frame size
                this.canvas.width = actualFrameWidth;
                this.canvas.height = this.canvas.id === "Referee" ? sourceFrameHeight : frameHeight;

                // Calculate display size maintaining aspect ratio
                const scale = this.scale.height / this.scaleFactor;
                const aspectRatio = actualFrameWidth / (this.canvas.id === "Referee" ? sourceFrameHeight : frameHeight);
                const displayHeight = scale;
                const displayWidth = scale * aspectRatio;

                // Update the display size
                this.canvas.style.width = `${displayWidth}px`;
                this.canvas.style.height = `${displayHeight}px`;
                this.canvas.style.position = 'absolute';
                this.canvas.style.left = `${this.position.x}px`;
                this.canvas.style.top = `${GameEnv.top + this.position.y}px`;
    
                // Draw the current frame of the sprite sheet
                this.ctx.drawImage(
                    this.spriteSheet,
                    frameX, frameY, 
                    this.canvas.id === "Referee" ? sourceFrameWidth : sourceFrameWidth,
                    this.canvas.id === "Referee" ? sourceFrameHeight : frameHeight,
                    0, 0, 
                    this.canvas.width, 
                    this.canvas.height
                );

                // Add dark green border specifically for Randy
                if (this.spriteData.id === 'Randy') {
                    this.ctx.save();
                    this.ctx.lineWidth = 10; // Much thicker border
                    this.ctx.strokeStyle = 'rgba(0, 100, 0, 1)'; // Dark green color
                    this.ctx.strokeRect(2, 2, this.canvas.width - 4, this.canvas.height - 4); // Inset slightly to ensure visibility
                    
                    // Add a second, outer stroke for extra visibility
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white
                    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.restore();
                }
    
            } catch (error) {
                console.error('Error drawing sprite:', error);
                // Fall back to red rectangle on error
                this.ctx.fillStyle = 'red';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        } else {
            // Draw default red square if sprite sheet isn't loaded
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawHitbox() {
        // Only draw hitbox for player
        if (this.canvas.id !== "player") return;

        // Use same hitbox dimensions as collision detection
        const myHitbox = {
            x: 0,  // Local coordinates for drawing
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height
        };

        // Save current context state
        this.ctx.save();

        // Set line style for hitbox - make it very visible
        this.ctx.lineWidth = 8;  // Thicker line
        this.ctx.strokeStyle = '#FF0000';  // Bright red
        this.ctx.setLineDash([5, 5]);  // Dashed line for visibility

        // Draw hitbox rectangle
        this.ctx.strokeRect(myHitbox.x, myHitbox.y, myHitbox.width, myHitbox.height);

        // Restore context state
        this.ctx.restore();

        // Debug log
        console.log('Drawing player hitbox:', myHitbox);
    }

    update() {
        // Update begins by drawing the object
        this.draw();

        this.collisionChecks();

        // Update or change position according to velocity events
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Ensure the object stays within the canvas boundaries
        // Bottom of the canvas
        if (this.position.y + this.height > GameEnv.innerHeight) {
            this.position.y = GameEnv.innerHeight - this.height;
            this.velocity.y = 0;
        }
        // Top of the canvas
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
        }
        // Right of the canvas
        if (this.position.x + this.width > GameEnv.innerWidth) {
            this.position.x = GameEnv.innerWidth - this.width;
            this.velocity.x = 0;
        }
        // Left of the canvas
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
        }
    }

    resize() {
        // Calculate the new scale resulting from the window resize
        const newScale = { width: GameEnv.innerWidth, height: GameEnv.innerHeight };

        // Adjust the object's position proportionally
        this.position.x = (this.position.x / this.scale.width) * newScale.width;
        this.position.y = (this.position.y / this.scale.height) * newScale.height;

        // Update the object's scale to the new scale
        this.scale = newScale;

        // Recalculate the object's size based on the new scale
        this.size = this.scale.height / this.scaleFactor; 

        // Recalculate the object's velocity steps based on the new scale
        this.xVelocity = this.scale.width / this.stepFactor;
        this.yVelocity = this.scale.height / this.stepFactor;

        // Set the object's width and height to the new size (object is a square)
        this.width = this.size;
        this.height = this.size;
    }
    
    destroy() {
        const index = GameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            // Remove the canvas from the DOM
            this.canvas.parentNode.removeChild(this.canvas);
            GameEnv.gameObjects.splice(index, 1);
        }
    }
    
    collisionChecks() {
        // Get all game objects
        const gameObjects = GameEnv.gameObjects;

        // Get current sprite's hitbox using canvas dimensions
        const myHitbox = {
            x: this.position.x,
            y: this.position.y,
            width: this.canvas.width,
            height: this.canvas.height
        };

        // Check collision with each other sprite
        for (const obj of gameObjects) {
            // Skip if it's the same object or not a Character
            if (obj === this || !(obj instanceof Character)) continue;

            // Get other sprite's hitbox using canvas dimensions
            const otherHitbox = {
                x: obj.position.x,
                y: obj.position.y,
                width: obj.canvas.width,
                height: obj.canvas.height
            };

            // Check for collision
            if (this.isColliding(myHitbox, otherHitbox)) {
                console.log(`Collision detected between ${this.canvas.id} and ${obj.canvas.id}`);
                
                // Handle tag game mechanics
                if ((this.canvas.id === "player" || this.canvas.id === "Bobby") &&
                    (obj.canvas.id === "player" || obj.canvas.id === "Bobby")) {
                    
                    // Switch tagger status if one is the tagger and the other isn't
                    if (this.state.isTagger !== obj.state.isTagger) {
                        console.log(`Switching tagger status: ${this.canvas.id} was ${this.state.isTagger}, ${obj.canvas.id} was ${obj.state.isTagger}`);
                        this.state.isTagger = !this.state.isTagger;
                        obj.state.isTagger = !obj.state.isTagger;
                        console.log(`New tagger status: ${this.canvas.id} is ${this.state.isTagger}, ${obj.canvas.id} is ${obj.state.isTagger}`);
                    }

                    // Always prevent passing through by pushing back
                    const overlapX = Math.min(
                        myHitbox.x + myHitbox.width - otherHitbox.x,
                        otherHitbox.x + otherHitbox.width - myHitbox.x
                    );
                    const overlapY = Math.min(
                        myHitbox.y + myHitbox.height - otherHitbox.y,
                        otherHitbox.y + otherHitbox.height - myHitbox.y
                    );

                    // Push back based on smaller overlap
                    if (overlapX < overlapY) {
                        // Push horizontally
                        if (this.velocity.x > 0) {
                            this.position.x = otherHitbox.x - myHitbox.width;
                        } else {
                            this.position.x = otherHitbox.x + otherHitbox.width;
                        }
                        this.velocity.x = 0;
                    } else {
                        // Push vertically
                        if (this.velocity.y > 0) {
                            this.position.y = otherHitbox.y - myHitbox.height;
                        } else {
                            this.position.y = otherHitbox.y + otherHitbox.height;
                        }
                        this.velocity.y = 0;
                    }
                }
            }
        }
    }
}

export default Character;