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

        // Set initial object properties 
        this.x = 0;
        this.y = 0;
        this.frame = 0;
        
        // Initialize the object's scale based on the game environment
        this.scale = { width: GameEnv.innerWidth, height: GameEnv.innerHeight };
        
        // Check if sprite data is provided
        if (data.src) {
            this.scaleFactor = data.SCALE_FACTOR || SCALE_FACTOR;
            this.stepFactor = data.STEP_FACTOR || STEP_FACTOR;
            this.animationRate = data.ANIMATION_RATE || ANIMATION_RATE;
            this.position = data.INIT_POSITION || INIT_POSITION;
    
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
                    this.canvas.id === "Referee" ? sourceFrameHeight : frameHeight, // Source rectangle
                    0, 0, 
                    this.canvas.width, 
                    this.canvas.height // Destination rectangle
                );
    
                // Stop animation by removing frame updates
                /*
                this.frameCounter++;
                if (this.frameCounter % this.animationRate === 0) {
                    // For NPCs, cycle through all frames in the sprite sheet
                    const totalFrames = orientation.rows * orientation.columns;
                    this.frameIndex = (this.frameIndex + 1) % totalFrames;
                }
                */
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
    
}

export default Character;