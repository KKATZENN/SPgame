class GameEnv {
    static gameObjects = [];
    static continueLevel = true;
    static canvas;
    static ctx;
    static innerWidth;
    static innerHeight;
    static top;
    static bottom;
    
    /**
     * Private constructor to prevent instantiation.
     * 
     * @constructor
     * @throws {Error} Throws an error if an attempt is made to instantiate the class.
     */
    constructor() {
        throw new Error('GameEnv is a static class and cannot be instantiated.');
    }

    /**
     * @static
     */
    static create() {
        console.log('GameEnv.create() called'); // Debug log
        this.setCanvas();
        this.setTop();
        this.setBottom();
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight - this.top - this.bottom;
        this.size();
        console.log('GameEnv.create() completed'); // Debug log
    }

    /**
     * @static
     */
    static setCanvas() {
        console.log('GameEnv.setCanvas() called'); // Debug log
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found!'); // Debug log
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        console.log('Canvas and context set up successfully'); // Debug log
    }

    /**
     * @static
     */
    static setTop() {
        console.log('GameEnv.setTop() called'); // Debug log
        const header = document.querySelector('header');
        this.top = header ? header.offsetHeight : 0;
        console.log('Top offset:', this.top); // Debug log
    }

    /**
     * Sets the bottom offset based on the height of the footer element.
     * 
     * @static
     */
    static setBottom() {
        console.log('GameEnv.setBottom() called'); // Debug log
        const footer = document.querySelector('footer');
        this.bottom = footer ? footer.offsetHeight : 0;
        console.log('Bottom offset:', this.bottom); // Debug log
    }

    /**
     * @static
     */
    static size() {
        this.canvas.width = this.innerWidth;
        this.canvas.height = this.innerHeight;
        this.canvas.style.width = `${this.innerWidth}px`;
        this.canvas.style.height = `${this.innerHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0px';
        this.canvas.style.top = `${this.top}px`;
        console.log('GameEnv.size() called'); // Debug log
        if (!this.canvas) {
            console.error('Cannot size: canvas is null'); // Debug log
            return;
        }

        // Set exact dimensions for the game area
        this.innerWidth = 2076;
        this.innerHeight = 1160;
        this.canvas.width = this.innerWidth;
        this.canvas.height = this.innerHeight;
        
        // Create a container div for the canvas if it doesn't exist
        let container = document.getElementById('gameContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'gameContainer';
            this.canvas.parentNode.insertBefore(container, this.canvas);
            container.appendChild(this.canvas);
        }

        // Create border element if it doesn't exist
        let border = document.getElementById('gameBorder');
        if (!border) {
            border = document.createElement('div');
            border.id = 'gameBorder';
            container.appendChild(border);
        }

        // Calculate scale to fit the game in the viewport
        const scale = Math.min(
            window.innerWidth / this.innerWidth,
            window.innerHeight / this.innerHeight
        );

        // Style the container
        container.style.width = this.innerWidth + 'px';
        container.style.height = this.innerHeight + 'px';
        container.style.position = 'fixed';
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'center top';
        container.style.left = '50%';
        container.style.marginLeft = -(this.innerWidth / 2) + 'px';
        container.style.top = '0';
        container.style.overflow = 'hidden';
        
        // Style the border element
        border.style.position = 'absolute';
        border.style.top = '0';
        border.style.left = '0';
        border.style.width = '100%';
        border.style.height = '100%';
        border.style.borderWidth = '8px';
        border.style.borderStyle = 'solid';
        border.style.borderColor = '#FFFFFF';
        border.style.pointerEvents = 'none';
        border.style.zIndex = '9999';
        border.style.boxSizing = 'border-box';
        
        // Style the canvas
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';

        // Disable scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.height = '100vh';
        document.body.style.backgroundColor = '#000';
        
        console.log('Game dimensions:', {
            width: this.innerWidth,
            height: this.innerHeight,
            scale: scale
        });
    }

    /**
     * @static
     */
    static resize() {
        console.log('GameEnv.resize() called'); // Debug log
        this.create();
    }

    /**
     * @static
     */
    static clear() {
        if (!this.ctx) {
            console.error('Cannot clear: context is null'); // Debug log
            return;
        }
        this.ctx.clearRect(0, 0, this.innerWidth, this.innerHeight);
    }
}

export default GameEnv;
