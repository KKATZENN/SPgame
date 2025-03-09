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

        console.log('Creating character:', data.id, 'with data:', data); // Enhanced debug log

        // Store the original data
        this.spriteData = data;

        // Initialize position and movement
        this.position = {
            x: data.INIT_POSITION?.x || 0,
            y: data.INIT_POSITION?.y || 0
        };
        this.velocity = { x: 0, y: 0 };
        this.speed = 5; // Base movement speed

        // If this is Randy (player), bind movement controls
        if (data.id === 'Randy') {
            console.log('Binding controls for Randy');
            this.bindMovementControls();
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
        console.log('Created canvas with ID:', this.canvas.id); // Debug log
        
        // Set canvas dimensions based on sprite data
        const scaledHeight = Math.floor(GameEnv.innerHeight / (data.SCALE_FACTOR || SCALE_FACTOR));
        const scaledWidth = Math.floor(scaledHeight * (data.pixels?.width || 32) / (data.pixels?.height || 32));
        this.canvas.width = scaledWidth;
        this.canvas.height = scaledHeight;
        console.log('Canvas dimensions for', data.id, ':', scaledWidth, 'x', scaledHeight); // Debug log

        this.hitbox = data?.hitbox || {};
        this.ctx = this.canvas.getContext('2d');
        
        // Append canvas to game container
        const container = document.getElementById("gameContainer");
        if (!container) {
            console.error('Game container not found!');
            return;
        }
        container.appendChild(this.canvas);
        console.log('Canvas appended to container for:', data.id);

        // Set tagger state after canvas is created
        this.state.isTagger = this.canvas.id === "player";

        // Set initial object properties 
        this.frame = 0;
        
        // Initialize the object's scale based on the game environment
        this.scale = { width: GameEnv.innerWidth, height: GameEnv.innerHeight };
        
        // Check if sprite data is provided
        if (data.src) {
            console.log('Loading sprite for', data.id, ':', data.src); // Enhanced debug log
            this.scaleFactor = data.SCALE_FACTOR || SCALE_FACTOR;
            this.stepFactor = data.STEP_FACTOR || STEP_FACTOR;
            this.animationRate = data.ANIMATION_RATE || ANIMATION_RATE;
    
            // Load the sprite sheet with enhanced error handling
            this.spriteSheet = new Image();
            
            // Set up load handlers before setting src
            this.spriteSheet.onload = () => {
                console.log('Sprite loaded successfully:', data.id, this.spriteSheet.src);
                // Verify image dimensions
                console.log('Sprite dimensions:', {
                    width: this.spriteSheet.width,
                    height: this.spriteSheet.height,
                    natural: {
                        width: this.spriteSheet.naturalWidth,
                        height: this.spriteSheet.naturalHeight
                    }
                });
                this.draw(); // Initial draw once loaded
            };

            this.spriteSheet.onerror = (error) => {
                console.error('Failed to load sprite:', data.id, error);
                // Try alternate paths
                const paths = [
                    data.src,
                    data.src.replace('/images/', '/assets/images/'),
                    data.src.replace('/images/rpg/', '/assets/images/rpg/'),
                    `/assets/images/rpg/${data.id.toLowerCase()}.png`
                ];
                
                console.log('Attempting alternate paths for', data.id, ':', paths);
                
                const tryNextPath = (pathIndex) => {
                    if (pathIndex >= paths.length) {
                        console.error('All paths failed for', data.id);
                        return;
                    }
                    
                    const path = paths[pathIndex];
                    console.log('Trying path:', path);
                    
                    const img = new Image();
                    img.onload = () => {
                        console.log('Success with path:', path);
                        this.spriteSheet = img;
                        this.draw();
                    };
                    img.onerror = () => {
                        console.log('Failed path:', path);
                        tryNextPath(pathIndex + 1);
                    };
                    img.src = path;
                };
                
                tryNextPath(1); // Start with first alternate path
            };

            // Set the initial source
            this.spriteSheet.src = data.src;
            console.log('Initial sprite source set for', data.id, ':', data.src);

            // Initialize animation properties
            this.frameIndex = 0;
            this.frameCounter = 0;
            this.direction = data.direction ;
            this.spriteData = {
                ...data,
                orientation: data.orientation || { rows: 4, columns: 3 },
                pixels: data.pixels || { width: 32, height: 32 }
            };
        } else {
            console.error('No sprite source provided for:', data.id);
            throw new Error('Sprite source (src) is required');
        }

        // Set initial canvas position
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.position.x}px`;
        this.canvas.style.top = `${this.position.y}px`;
        
        // Add this object to the gameLoop
        GameEnv.gameObjects.push(this);
        console.log('Added to game objects:', data.id);

        // Set the initial size and velocity of the object
        this.resize();
    }

    bindMovementControls() {
        // Debug log for initialization
        console.log('Initializing movement controls for:', this.spriteData.id);
        console.log('Keypress config:', this.spriteData.keypress);

        const handleKeyDown = (event) => {
            console.log('Key pressed:', event.keyCode, 'Key:', event.key); // Debug both keyCode and key
            const keypress = this.spriteData.keypress;
            if (!keypress) {
                console.warn('No keypress configuration found');
                return;
            }

            let moved = false;
            switch(event.keyCode) {
                case keypress.up: // W
                    this.velocity.y = -this.speed;
                    this.direction = 'up';
                    moved = true;
                    break;
                case keypress.down: // S
                    this.velocity.y = this.speed;
                    this.direction = 'down';
                    moved = true;
                    break;
                case keypress.left: // A
                    this.velocity.x = -this.speed;
                    this.direction = 'left';
                    moved = true;
                    break;
                case keypress.right: // D
                    this.velocity.x = this.speed;
                    this.direction = 'right';
                    moved = true;
                    break;
            }

            if (moved) {
                console.log('Movement update:', {
                    direction: this.direction,
                    velocity: this.velocity,
                    position: this.position
                });
            }
        };

        const handleKeyUp = (event) => {
            const keypress = this.spriteData.keypress;
            if (!keypress) return;

            switch(event.keyCode) {
                case keypress.up:
                case keypress.down:
                    this.velocity.y = 0;
                    break;
                case keypress.left:
                case keypress.right:
                    this.velocity.x = 0;
                    break;
            }
            console.log('Key released, new velocity:', this.velocity);
        };

        // Remove any existing listeners before adding new ones
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);

        // Add the event listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        console.log('Movement controls bound successfully');
    }

    draw() {
        if (!this.canvas || !this.ctx) {
            console.error('Canvas or context not available:', this.spriteData?.id);
            return;
        }

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Only draw if we have a valid sprite sheet that's loaded
        if (this.spriteSheet && this.spriteSheet.complete && this.spriteSheet.naturalHeight !== 0) {
            try {
                // Get sprite orientation data
                const orientation = this.spriteData?.orientation || { rows: 4, columns: 3 };
                const spriteWidth = this.spriteData.pixels.width / orientation.columns;
                const spriteHeight = this.spriteData.pixels.height / orientation.rows;

                // Get current direction data
                const directionData = this.spriteData[this.direction];
                if (!directionData) {
                    console.error('No direction data for:', this.direction, this.spriteData?.id);
                    return;
                }

                const row = directionData.row || 0;
                const column = (directionData.start || 0) + this.frameIndex;

                // Log drawing parameters
                console.log('Drawing sprite:', {
                    id: this.spriteData.id,
                    direction: this.direction,
                    frame: this.frameIndex,
                    position: { row, column },
                    source: { x: column * spriteWidth, y: row * spriteHeight },
                    dimensions: { width: spriteWidth, height: spriteHeight }
                });

                // Draw the current frame of the sprite sheet
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

                // Draw outline if character is tagged
                if (this.spriteData.color === "red") {
                    this.ctx.save();
                    this.ctx.lineWidth = 8;
                    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.restore();
                }

                // Update animation frame
                this.frameCounter++;
                if (this.frameCounter >= this.animationRate) {
                    this.frameCounter = 0;
                    this.frameIndex = (this.frameIndex + 1) % (directionData.columns || 3);
                }
            } catch (error) {
                console.error('Error drawing sprite:', this.spriteData?.id, error);
                // Fall back to colored rectangle on error
                this.ctx.fillStyle = this.spriteData.id === 'Bobby' ? 'blue' : 'red';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        } else {
            // Draw default colored square if sprite sheet isn't loaded
            console.warn('Sprite not loaded:', this.spriteData?.id);
            this.ctx.fillStyle = this.spriteData.id === 'Bobby' ? 'blue' : 'red';
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
        // Update position based on velocity
        const oldPosition = { ...this.position };
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Keep within bounds
        this.position.x = Math.max(0, Math.min(this.position.x, GameEnv.innerWidth - this.canvas.width));
        this.position.y = Math.max(0, Math.min(this.position.y, GameEnv.innerHeight - this.canvas.height));

        // Only update and log if position actually changed
        if (oldPosition.x !== this.position.x || oldPosition.y !== this.position.y) {
            // Update canvas position
            if (this.canvas) {
                this.canvas.style.position = 'absolute';
                this.canvas.style.left = `${this.position.x}px`;
                this.canvas.style.top = `${this.position.y}px`;
                
                if (this.spriteData.id === 'Randy') {
                    console.log('Randy moved:', {
                        from: oldPosition,
                        to: this.position,
                        velocity: this.velocity
                    });
                }
            }
        }

        // Draw the sprite
        this.draw();

        // Check for collisions
        this.collisionChecks();
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