import GameEnv from './SPgame/GameEnv.js';
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

class PLayer extends GameObject{
    /**
     * @param {Object|null} data
     */
    constructor(data = null) {
        super(data);
        // Initialize the player's scale based on the game environment
        this.scale = { width: GameEnv.innerWidth, height: GameEnv.innerHeight };
        
        // Check if sprite data is provided
        if (data && data.src) {
            this.scaleFactor = data.SCALE_FACTOR || SCALE_FACTOR;
            this.stepFactor = data.STEP_FACTOR || STEP_FACTOR;
            this.animationRate = data.ANIMATION_RATE || ANIMATION_RATE;
            this.position = data.INIT_POSITION || INIT_POSITION;
    
            // Load the sprite sheet
            this.spriteSheet = new Image();
            this.spriteSheet.src = data.src;

            // Initialize animation properties
            this.frameIndex = 0; // index reference to current frame
            this.frameCounter = 0; // count each frame rate refresh
            this.direction = 'up'; // Initial direction
            this.spriteData = data;
        } else {
            // Default to red square
            this.scaleFactor = SCALE_FACTOR;
            this.stepFactor = STEP_FACTOR;
            this.animationRate = ANIMATION_RATE;
            this.position = INIT_POSITION;

            // No sprite sheet for defaultgit 
            this.spriteSheet = null;
        }

        // Initialize the player's position and velocity
        this.velocity = { x: 0, y: 0 };

        // Set the initial size and velocity of the player
        this.resize();

        // Bind event listeners to allow object movement
        this.bindEventListeners();
    }

}
