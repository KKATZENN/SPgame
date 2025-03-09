import GameEnv from './GameEnv.js';
import GameObject from './GameObjects.js';

class Background extends GameObject {
    constructor(data = null) {
        super();

        if (!data || !data.src) {
            console.error('Background initialization failed: Missing data or source');
            throw new Error('Background data and source are required');
        }

        console.log('Initializing Background with path:', data.src);
        console.log('GameEnv dimensions:', { width: GameEnv.innerWidth, height: GameEnv.innerHeight });

        this.data = data;
        this.isLoaded = false;
        this.loadAttempts = 0;
        this.maxAttempts = 2;

        this.setupCanvas();
        this.loadBackgroundImage();

        this.boundResizeHandler = this.handleResize.bind(this);
        window.addEventListener('resize', this.boundResizeHandler);
        
        GameEnv.gameObjects.push(this);
    }

    setupCanvas() {
        try {
            this.canvas = document.createElement("canvas");
            this.canvas.id = "background";
            
            // Set dimensions and log them
            this.canvas.width = GameEnv.innerWidth;
            this.canvas.height = GameEnv.innerHeight;
            console.log('Canvas dimensions set to:', { width: this.canvas.width, height: this.canvas.height });
            
            Object.assign(this.canvas.style, {
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                height: '100%',
                zIndex: '-1'
            });
            
            this.ctx = this.canvas.getContext('2d', {
                alpha: false,
                willReadFrequently: false
            });
            
            const container = document.getElementById("gameContainer");
            if (!container) {
                console.error('Game container not found');
                throw new Error('Game container not found');
            }
            
            container.insertBefore(this.canvas, container.firstChild);
            console.log('Canvas setup completed successfully');
        } catch (error) {
            console.error('Canvas setup failed:', error);
            throw error;
        }
    }

    loadBackgroundImage() {
        this.loadAttempts++;
        console.log(`Attempting to load background image (attempt ${this.loadAttempts}/${this.maxAttempts}):`, this.data.src);

        const img = new Image();
        
        img.onload = () => {
            console.log('Background image loaded successfully:', {
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
            });
            
            this.image = img;
            this.isLoaded = true;
            
            if (this.data.tile) {
                this.pattern = this.ctx.createPattern(this.image, 'repeat');
                console.log('Pattern created for tiled background');
            }
            
            this.draw();
        };

        img.onerror = () => {
            console.error('Failed to load image from path:', this.data.src);
            
            if (this.loadAttempts < this.maxAttempts) {
                const altPath = this.data.src.replace('/images/', '/assets/images/');
                console.log('Trying alternate path:', altPath);
                this.data.src = altPath;
                this.loadBackgroundImage();
            } else {
                console.warn('Max load attempts reached, falling back to gradient');
                this.drawFallback();
            }
        };

        img.src = this.data.src;
    }

    drawFallback() {
        if (!this.ctx) {
            console.error('Cannot draw fallback: No canvas context');
            return;
        }

        console.log('Drawing fallback gradient background');
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#90EE90');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        if (!this.ctx) {
            console.error('Cannot draw: No canvas context');
            return;
        }

        if (!this.isLoaded) {
            console.log('Image not loaded yet, skipping draw');
            return;
        }

        console.log('Drawing background frame');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        try {
            if (this.data.tile && this.pattern) {
                console.log('Drawing tiled background');
                this.ctx.fillStyle = this.pattern;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                return;
            }

            const canvasAspect = this.canvas.width / this.canvas.height;
            const imageAspect = this.image.naturalWidth / this.image.naturalHeight;
            
            let drawWidth = this.canvas.width;
            let drawHeight = this.canvas.height;
            let offsetX = 0;
            let offsetY = 0;

            console.log('Drawing with mode:', {
                stretch: this.data.stretch,
                contain: this.data.contain,
                canvasAspect,
                imageAspect
            });

            if (this.data.stretch) {
                this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
            } else if (this.data.contain) {
                if (canvasAspect > imageAspect) {
                    drawWidth = drawHeight * imageAspect;
                    offsetX = (this.canvas.width - drawWidth) / 2;
                } else {
                    drawHeight = drawWidth / imageAspect;
                    offsetY = (this.canvas.height - drawHeight) / 2;
                }
                this.ctx.drawImage(this.image, offsetX, offsetY, drawWidth, drawHeight);
            } else {
                if (canvasAspect > imageAspect) {
                    drawHeight = this.canvas.width / imageAspect;
                    offsetY = (this.canvas.height - drawHeight) / 2;
                } else {
                    drawWidth = this.canvas.height * imageAspect;
                    offsetX = (this.canvas.width - drawWidth) / 2;
                }
                this.ctx.drawImage(this.image, offsetX, offsetY, drawWidth, drawHeight);
            }

            console.log('Background drawn successfully with dimensions:', {
                drawWidth,
                drawHeight,
                offsetX,
                offsetY
            });
        } catch (error) {
            console.error('Error drawing background:', error);
            this.drawFallback();
        }
    }

    handleResize() {
        console.log('Handling resize event');
        console.log('New GameEnv dimensions:', {
            width: GameEnv.innerWidth,
            height: GameEnv.innerHeight
        });

        this.canvas.width = GameEnv.innerWidth;
        this.canvas.height = GameEnv.innerHeight;

        if (this.data.tile && this.image && this.isLoaded) {
            console.log('Recreating pattern for tiled background after resize');
            this.pattern = this.ctx.createPattern(this.image, 'repeat');
        }

        this.draw();
    }

    update() {
        // Background is static, no updates needed
    }

    destroy() {
        console.log('Cleaning up background resources');
        window.removeEventListener('resize', this.boundResizeHandler);
        
        const index = GameEnv.gameObjects.indexOf(this);
        if (index !== -1) {
            GameEnv.gameObjects.splice(index, 1);
        }

        if (this.canvas?.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

export default Background;