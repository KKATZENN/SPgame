import GameEnv from './GameEnv.js';
import GameObject from './GameObjects.js';

const SCALE_FACTOR = 25; // 1/nth of the height of the canvas
const STEP_FACTOR = 100; // 1/nth, or N steps up and across the canvas
const ANIMATION_RATE = 1; // 1/nth of the frame rate
const INIT_POSITION = { x: 0, y: 0 };

/**
  * @abstract Player
 * @property {Object} position - The current position of the player.
 * @property {Object} velocity - The current velocity of the player.
 * @property {Object} scale - The scale of the player based on the game environment.
 * @property {number} size - The size of the player.
 * @property {number} width - The width of the player.
 * @property {number} height - The height of the player.
 * @property {number} xVelocity - The velocity of the player along the x-axis.
 * @property {number} yVelocity - The velocity of the player along the y-axis.
 * @property {Image} spriteSheet - The sprite sheet image for the player.
 * @property {number} frameIndex - The current frame index for animation.
 * @property {number} frameCount - The total number of frames for each direction.
 * @property {Object} spriteData - The data for the sprite sheet.
 * @property {number} frameCounter - Counter to control the animation rate.
 * @method resize - Resizes the player based on the game environment.
 * @method draw - Draws the player on the canvas.
 * @method update - Updates the player's position and ensures it stays within the canvas boundaries.
 * @method bindEventListeners - Binds key event listeners to handle player movement.
 * @method handleKeyDown - Handles key down events to change the player's velocity.
 * @method handleKeyUp - Handles key up events to stop the player's velocity.
 */

class Player extends GameObject {
    /**
     * @param {Object|null} data
     */
    constructor(data = null) {
        super(data);
        // Initialize the player's scale based on the game environment
        this.scale = { width: GameEnv.innerWidth, height: GameEnv.innerHeight };
        
        // Create canvas element
        this.canvas = document.createElement("canvas");
        this.canvas.id = data?.id || "player";
        this.ctx = this.canvas.getContext('2d');
        document.getElementById("gameContainer").appendChild(this.canvas);
        
        // Check if sprite data is provided
        if (data && data.src) {
            this.scaleFactor = data.SCALE_FACTOR || SCALE_FACTOR;
            this.stepFactor = data.STEP_FACTOR || STEP_FACTOR;
            this.animationRate = data.ANIMATION_RATE || ANIMATION_RATE;
            this.position = data.INIT_POSITION || INIT_POSITION;
    
            // Load the sprite sheet with error handling
            this.spriteSheet = new Image();
            this.spriteSheet.onload = () => {
                console.log('Sprite sheet loaded successfully:', data.src);
            };
            this.spriteSheet.onerror = (error) => {
                console.error('Failed to load sprite sheet:', data.src, error);
            };
            this.spriteSheet.src = data.src;
            console.log('Attempting to load sprite sheet from:', data.src);

            // Initialize animation properties
            this.frameIndex = 0;
            this.frameCounter = 0;
            this.direction = 'up';
            this.spriteData = data;
            console.log('Sprite data:', this.spriteData);
        } else {
            console.warn('No sprite data provided, falling back to default red square');
            this.scaleFactor = SCALE_FACTOR;
            this.stepFactor = STEP_FACTOR;
            this.animationRate = ANIMATION_RATE;
            this.position = INIT_POSITION;
            this.spriteSheet = null;
        }

        // Initialize the player's position and velocity
        this.velocity = { x: 0, y: 0 };

        // Set the initial size and velocity of the player
        this.resize();

        // Bind event listeners to allow object movement
        this.bindEventListeners();
    }

    bindEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        // Get key mappings from sprite data or use defaults
        const keyMap = this.spriteData?.keypress || {
            up: 38,    // Up Arrow
            down: 40,  // Down Arrow
            left: 37,  // Left Arrow
            right: 39  // Right Arrow
        };

        switch (event.keyCode) {
            case keyMap.up:
                this.velocity.y = -this.yStep;
                this.direction = 'up';
                break;
            case keyMap.down:
                this.velocity.y = this.yStep;
                this.direction = 'down';
                break;
            case keyMap.left:
                this.velocity.x = -this.xStep;
                this.direction = 'left';
                break;
            case keyMap.right:
                this.velocity.x = this.xStep;
                this.direction = 'right';
                break;
        }
    }

    handleKeyUp(event) {
        const keyMap = this.spriteData?.keypress || {
            up: 38,
            down: 40,
            left: 37,
            right: 39
        };

        switch (event.keyCode) {
            case keyMap.up:
            case keyMap.down:
                this.velocity.y = 0;
                break;
            case keyMap.left:
            case keyMap.right:
                this.velocity.x = 0;
                break;
        }
    }

    draw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the sprite FIRST
        if (this.spriteSheet) {
            // Get sprite orientation data
            const orientation = this.spriteData?.orientation || { rows: 4, columns: 3 };
            const spriteWidth = this.spriteData.pixels.width / orientation.columns;
            const spriteHeight = this.spriteData.pixels.height / orientation.rows;

            // Get current direction data
            const directionData = this.spriteData[this.direction];
            const row = directionData?.row || 0;

            // Calculate the x position on the sprite sheet
            // Cycle through frames based on frameIndex
            const column = (directionData?.start || 0) + this.frameIndex;

            // Draw the sprite
            this.ctx.drawImage(
                this.spriteSheet,
                column * spriteWidth,
                row * spriteHeight,
                spriteWidth,
                spriteHeight,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            // Update frame index for animation
            this.frameCounter++;
            if (this.frameCounter >= this.animationRate) {
                this.frameCounter = 0;
                this.frameIndex = (this.frameIndex + 1) % (directionData?.columns || 3);
            }

            // Draw hitbox AFTER sprite (only if sprite loaded successfully)
            // Save context state
            this.ctx.save();
            
            // Set line style for hitbox - just the outline
            this.ctx.lineWidth = 4;  // Thinner line
            this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';  // Semi-transparent red
            this.ctx.setLineDash([5, 5]);  // Dashed line for better visibility
            
            // Draw just the outline
            this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Restore context state
            this.ctx.restore();
        } else {
            // Draw a default red rectangle if no sprite sheet
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    update() {
        // Update position based on velocity
        if (this.state.movement.up && this.velocity.y < 0 ||
            this.state.movement.down && this.velocity.y > 0) {
            this.position.y += this.velocity.y;
        }
        if (this.state.movement.left && this.velocity.x < 0 ||
            this.state.movement.right && this.velocity.x > 0) {
            this.position.x += this.velocity.x;
        }

        // Keep player within canvas bounds
        this.position.x = Math.max(0, Math.min(this.position.x, GameEnv.innerWidth - this.width));
        this.position.y = Math.max(0, Math.min(this.position.y, GameEnv.innerHeight - this.height));

        // Update canvas position
        this.canvas.style.left = `${this.position.x}px`;
        this.canvas.style.top = `${this.position.y}px`;

        // Check for collisions with other game objects
        this.collisionChecks();

        // Draw the updated player
        this.draw();
    }

    resize() {
        // Calculate size based on game environment
        const height = Math.floor(GameEnv.innerHeight / this.scaleFactor);
        const width = Math.floor(height * (this.spriteData?.pixels?.width || 1) / (this.spriteData?.pixels?.height || 1));
        
        // Set canvas size
        this.canvas.width = width;
        this.canvas.height = height;

        // Set object position based on game environment
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.position.x}px`;
        this.canvas.style.top = `${this.position.y}px`;

        // Calculate movement step sizes
        this.size = height;
        this.width = width;
        this.height = height;
        this.xStep = Math.floor(GameEnv.innerWidth / this.stepFactor);
        this.yStep = Math.floor(GameEnv.innerHeight / this.stepFactor);
    }
}

export default Player;
