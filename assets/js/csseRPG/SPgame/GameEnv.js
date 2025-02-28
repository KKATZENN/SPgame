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
        console.log('GameEnv.size() called'); // Debug log
        if (!this.canvas) {
            console.error('Cannot size: canvas is null'); // Debug log
            return;
        }

        // Set exact dimensions without scaling
        this.canvas.width = 2076;
        this.canvas.height = 1160;
        this.innerWidth = 2076;
        this.innerHeight = 1160;
        
        // Create a container div for the canvas if it doesn't exist
        let container = document.getElementById('gameContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'gameContainer';
            this.canvas.parentNode.insertBefore(container, this.canvas);
            container.appendChild(this.canvas);
        }

        // Style the container to match exact background size
        container.style.width = '2076px';
        container.style.height = '1160px';
        container.style.position = 'relative';
        container.style.margin = '0 auto';
        
        // Style the canvas to match exact size
        this.canvas.style.width = '2076px';
        this.canvas.style.height = '1160px';
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';

        // Enable scrolling on body if content overflows
        document.body.style.overflow = 'auto';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        
        console.log('Canvas sized:', { width: this.innerWidth, height: this.innerHeight }); // Debug log
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
