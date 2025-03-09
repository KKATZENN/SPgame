import Character from "./Character.js";
import GameEnv from './GameEnv.js';

class NPC extends Character {
    constructor(data = null) {
        // Call parent constructor first
        super(data);
        
        if (!data) {
            console.error('NPC initialized without data');
            throw new Error('NPC requires initialization data');
        }

        console.log('Creating NPC:', data.id, 'with full data:', JSON.stringify(data, null, 2));

        // Store the sprite data
        this.spriteData = data;
        
        // Initialize animation properties
        this.frameIndex = 0;
        this.frameCounter = 0;
        this.direction = 'down';
        
        // Initialize velocity and movement for NPCs
        if (data.id === 'Bobby') {
            console.log('Initializing Bobby with enhanced debugging');
            this.velocity = { x: 2, y: 2 };
            this.speed = 2;
            this.direction = 'down';
            
            // Store initial position with validation
            this.position = {
                x: data.INIT_POSITION?.x || GameEnv.innerWidth / 4,
                y: data.INIT_POSITION?.y || GameEnv.innerHeight / 4
            };
            console.log('Bobby initial position:', this.position);
        } else if (data.id === 'Paul') {
            this.velocity = { x: 0, y: 0 };
            this.speed = 3;
            this.direction = 'down';
            // Store initial position
            this.position = {
                x: data.INIT_POSITION?.x || 300,
                y: data.INIT_POSITION?.y || 300
            };
            console.log('Paul initial position:', this.position);
            
            // Bind WASD controls for Paul
            this.keys = { w: false, a: false, s: false, d: false };
            this.bindPaulControls();
        }

        // Load sprite image
        this.loadSprite();
    }

    bindPaulControls() {
        console.log('Binding WASD controls for Paul');
        
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
                this.keys[key] = true;
                console.log('Paul key pressed:', key, this.keys);
            }
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
                this.keys[key] = false;
                console.log('Paul key released:', key, this.keys);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    }

    update() {
        // Update NPC state
        if (this.spriteData.id === 'Bobby') {
            this.updateBobby();
        } else if (this.spriteData.id === 'Paul') {
            this.updatePaul();
        }

        // Ensure canvas exists and is properly positioned
        if (this.canvas) {
            // Update canvas position with bounds checking
            const maxX = GameEnv.innerWidth - this.canvas.width;
            const maxY = GameEnv.innerHeight - this.canvas.height;
            
            // Clamp position within bounds
            this.position.x = Math.max(0, Math.min(this.position.x, maxX));
            this.position.y = Math.max(0, Math.min(this.position.y, maxY));
            
            // Update canvas position
            this.canvas.style.position = 'absolute';
            this.canvas.style.left = `${this.position.x}px`;
            this.canvas.style.top = `${this.position.y}px`;
            
            // Ensure canvas is visible
            this.canvas.style.display = 'block';
            this.canvas.style.zIndex = '1';
        }

        // Draw after updating position
        this.draw();
    }

    updateBobby() {
        if (this.spriteData.id !== 'Bobby') return;
        
        // Update position based on velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Calculate sprite dimensions
        const spriteWidth = this.canvas.width;
        const spriteHeight = this.canvas.height;
        
        // Calculate bounds with sprite dimensions
        const maxX = GameEnv.innerWidth - spriteWidth;
        const maxY = GameEnv.innerHeight - spriteHeight;
        
        // Ensure Bobby stays within bounds
        if (this.position.x <= 0) {
            this.position.x = 0;
            this.velocity.x *= -1;
        }
        if (this.position.x >= maxX) {
            this.position.x = maxX;
            this.velocity.x *= -1;
        }
        
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y *= -1;
        }
        if (this.position.y >= maxY) {
            this.position.y = maxY;
            this.velocity.y *= -1;
        }
    }

    updatePaul() {
        // Reset velocity
        this.velocity = { x: 0, y: 0 };

        // Update velocity based on keys
        if (this.keys.w) this.velocity.y = -this.speed;
        if (this.keys.s) this.velocity.y = this.speed;
        if (this.keys.a) this.velocity.x = -this.speed;
        if (this.keys.d) this.velocity.x = this.speed;

        // Move Paul
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Keep within bounds
        this.position.x = Math.max(0, Math.min(this.position.x, GameEnv.innerWidth - this.canvas.width));
        this.position.y = Math.max(0, Math.min(this.position.y, GameEnv.innerHeight - this.canvas.height));
    }

    loadSprite() {
        if (!this.spriteData || !this.spriteData.src) {
            console.error('Cannot load sprite: Missing sprite data or source');
            console.log('Sprite data:', this.spriteData);
            return;
        }

        this.spriteImage = new Image();
        this.spriteImage.src = this.spriteData.src;
        
        console.log(`Loading sprite for ${this.spriteData.id} from:`, this.spriteData.src);
        
        this.spriteImage.onload = () => {
            console.log(`Sprite loaded for ${this.spriteData.id}:`, {
                src: this.spriteData.src,
                naturalWidth: this.spriteImage.naturalWidth,
                naturalHeight: this.spriteImage.naturalHeight
            });
            this.isLoaded = true;
        };
        
        this.spriteImage.onerror = (error) => {
            console.error(`Failed to load sprite for ${this.spriteData.id}:`, error);
            console.log('Attempted sprite path:', this.spriteData.src);
            
            // Try alternate path
            const altPath = this.spriteData.src.replace('/images/', '/assets/images/');
            if (altPath !== this.spriteData.src) {
                console.log(`Trying alternate path for ${this.spriteData.id}:`, altPath);
                this.spriteImage.src = altPath;
            }
        };
    }

    draw() {
        if (!this.canvas || !this.ctx) {
            console.error(`Canvas or context not available for ${this.spriteData?.id}`);
            return;
        }

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sprite if loaded
        if (this.spriteImage && this.spriteImage.complete && this.spriteImage.naturalHeight !== 0) {
            try {
                // Log dimensions once
                if (!this.hasLoggedDimensions) {
                    console.log(`${this.spriteData.id} sprite dimensions:`, {
                        natural: {
                            width: this.spriteImage.naturalWidth,
                            height: this.spriteImage.naturalHeight
                        },
                        canvas: {
                            width: this.canvas.width,
                            height: this.canvas.height
                        }
                    });
                    this.hasLoggedDimensions = true;
                }

                // Calculate frame dimensions
                const frameWidth = this.spriteData.pixels.width;
                const frameHeight = this.spriteData.pixels.height;
                
                // Calculate display size
                const displayWidth = frameWidth / this.spriteData.SCALE_FACTOR;
                const displayHeight = frameHeight / this.spriteData.SCALE_FACTOR;
                
                // Draw the static sprite
                this.ctx.drawImage(
                    this.spriteImage,
                    this.spriteData.staticFrame.x,
                    this.spriteData.staticFrame.y,
                    frameWidth,
                    frameHeight,
                    0, 0,
                    displayWidth,
                    displayHeight
                );
                
                // Draw hitbox for debugging
                this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
                this.ctx.lineWidth = 8;
                this.ctx.strokeRect(0, 0, displayWidth, displayHeight);

            } catch (error) {
                console.error(`Error drawing ${this.spriteData?.id}:`, error);
                this.drawFallback();
            }
        } else {
            this.drawFallback();
        }
    }

    drawFallback() {
        // Draw placeholder with position info
        this.ctx.fillStyle = this.spriteData.id === 'Bobby' ? 'rgba(0, 0, 255, 0.5)' : 'red';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw debug info
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(`${this.spriteData?.id} (${Math.round(this.position.x)}, ${Math.round(this.position.y)})`, 5, 15);
        this.ctx.restore();
    }
}

export default NPC;
