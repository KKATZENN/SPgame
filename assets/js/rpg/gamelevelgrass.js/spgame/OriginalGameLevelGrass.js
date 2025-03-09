//import GameEnv from './GameEnv.js'; 
//import GameControl from './GameControl.js';
//import Background from './Background.js';
//import Player from './Player.js';
//import Npc from './Npc.js';

















////////////////////////////////////////////


class GameLevelGrass {
  constructor(path) {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    // Values dependent on GameEnv.create()
    let width = GameEnv.innerWidth;
    let height = GameEnv.innerHeight;


    //Use site.baseurl for image paths
    //const img_src_grass = path + "/images/rpg/spritesheet (grass).png";
    const img_src_grass = path + "/images/rpg/turtle.png";
    const image_data_grass = {
      name: 'Grass',
      greeting: "Welcome to the grass field! The grass is smooth, the stakes are high, and it's time for some intense tag play ",
      src: img_src_grass,
     // pixels: { height: height , width: width }
     pixels: {height: 580, width: 1038}
     };

  function updatedrift() {
    diftTime += 0.05;
    return Math.sin(driftTime) * 0.5;
   }

    //Data for Player
    const sprite_src_Randy = path + "/images/rpg/player_spritesheet.png";
    console.log("Randy sprite path:", sprite_src_Randy); 
    const RANDY_SCALE_FACTOR = 6;
    this.sprite_data_Randy = {
      id: 'Randy',
      greeting: "Hey there, Im Randy. Ready for some tag?",
      src: sprite_src_Randy,
      SCALE_FACTOR: RANDY_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: {x:50, y: 50},
      pixels: {height: 384, width: 512},
      orientation: {rows: 4, columns: 3}, //
      direction: "right", 
      right: {row: 0, start: 0, columns: 3 },
      left: {row: 2, start: 0, columns: 3 },
      down: {row: 1, start: 0, columns: 3 },
      up: {row: 3, start: 0, columns: 3 },
      hitbox: { widthPercentage: 1, heightPercentage: 1 },
      keypress: { up: 87, left: 65, down: 83, right: 68 } // W=87, A=65, S=83, D=68
    };

    // Path to Bobby's sprite sheet
const sprite_src_Bobby = path + "/images/rpg/sprite_sheet (2).png";

// Bobby's sprite configuration
const BOBBY_SCALE_FACTOR = 18 / 4; // Scale factor for Bobby

this.sprite_data_Bobby = {
    id: 'Bobby',
    greeting: "What's up! I am Bobby, let's play tag!",
    src: sprite_src_Bobby,
    SCALE_FACTOR: BOBBY_SCALE_FACTOR,
    INIT_POSITION: { x: 200, y: 200 },
    pixels: { 
        height: (768 / 3) * 4, // Multiply height by 4 to get actual height
        width: (512 / 2) * 4   // Multiply width by 4 to get actual width
    },
    orientation: { rows: 1, columns: 1 },
    // Adjust hitbox directly using sprite dimensions
    hitbox: {
        width: (512 / 2) * 4 * 0.45, // 45% of Bobby's scaled width
        height: (768 / 3) * 4 * 0.3  // 30% of Bobby's scaled height
    },
    staticFrame: { x: 0, y: 0 }
};
/**
 * Draws the object on the canvas.
 * 
 * This method renders the object using the sprite sheet if provided, otherwise a red square.
 */
function draw() {
  if (this.spriteSheet) {
      // Sprite Sheet frame size: pixels = total pixels / total frames
      const frameWidth = this.spriteData.pixels.width / this.spriteData.orientation.columns;
      const frameHeight = this.spriteData.pixels.height / this.spriteData.orientation.rows;

      // Sprite Sheet direction data source (e.g., front, left, right, back)
      const directionData = this.spriteData[this.direction];

      // Sprite Sheet x and y declarations to store coordinates of current frame
      let frameX, frameY;
      // Sprite Sheet x and y current frame: coordinate = (index) * (pixels)
      frameX = (directionData.start + this.frameIndex) * frameWidth;
      frameY = directionData.row * frameHeight;

      // Set up the canvas dimensions and styles
      this.canvas.width = frameWidth;
      this.canvas.height = frameHeight;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.canvas.style.position = 'absolute';
      this.canvas.style.left = `${this.position.x}px`;
      this.canvas.style.top = `${this.gameEnv.top + this.position.y}px`;

      // ... Transformations and animation omitted

      // Clear the canvas before drawing
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);            

      // Update the frame index for animation at a slower rate
      this.frameCounter++;
      if (this.frameCounter % this.animationRate === 0) {
          this.frameIndex = (this.frameIndex + 1) % directionData.columns;
      }
  } else {
      // Draw default red square
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
    //Data for the "Paul" helper NPC
    const sprite_src_Paul = path + "/images/rpg/sprite_sheet (4).png";
    console.log("Paul sprite path:", sprite_src_Paul);
    const PAUL_SCALE_FACTOR = 6;
    this.sprite_data_Paul = {
        id: 'Paul',
        greeting: "Hey, Im Paul, i'll increase your speed for you!",
        src: sprite_src_Paul,
        SCALE_FACTOR: PAUL_SCALE_FACTOR,
        INIT_POSITION: {x: 400, y: 100},
        pixels: {height: 768, width: 512},
        orientation: { rows: 1, columns: 1 },
        hitbox: {
            widthPercentage: 0.25 * 0.75,
            heightPercentage: 0.25 * 2 // Keep Paul's height as doubled only
        },
        staticFrame: { x: 0, y: 0 }
    };

    // Initialize game objects with Bobby
    const gameObjects = [
        { class: Background, data: image_data_grass },
        { class: Player, data: this.sprite_data_Randy },
        { class: Npc, data: this.sprite_data_Bobby },
        { class: Npc, data: this.sprite_data_Paul }
    ];

   
    console.log('Game objects initialized with Bobby:', gameObjects);

    // Assign gameObjects to this.objects
    this.objects = gameObjects;

    this.draw();
    // Bobby's position and movement properties
    this.bobbyPosition = { x: this.sprite_data_Bobby.INIT_POSITION.x, y: this.sprite_data_Bobby.INIT_POSITION.y };
    this.bobbyVelocity = { x: 2, y: 2 }; // Speed at which Bobby moves in the x and y direction
    this.bobbyDirection = Math.random() * Math.PI * 2; // Random starting direction (angle)
    this.bobbySpeed = 2; // Bobby's movement speed

    // Randy's position tracking
    this.playerPosition = { x: this.sprite_data_Randy.INIT_POSITION.x, y: this.sprite_data_Randy.INIT_POSITION.y };
    
    // Handle Bobby's movement and bouncing off walls
    this.updateBobbyPosition = this.updateBobbyPosition.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.updateCurrentTagger = this.updateCurrentTagger.bind(this);

    // Initialize tag states
    this.bobbyTagged = false;
    this.playerTagged = false;

    // Start the game loop
    requestAnimationFrame(this.gameLoop);
  }

  // Update Bobby's position and make him bounce off the walls
  updateBobbyPosition() {
    // Move Bobby in the direction he's facing
    this.bobbyPosition.x += this.bobbyVelocity.x;
    this.bobbyPosition.y += this.bobbyVelocity.y;
    
    // Check for collisions with walls (bouncing logic)
    const canvasWidth = GameEnv.innerWidth; // Updated canvas width (grass field)
    const canvasHeight = GameEnv.innerHeight; // Updated canvas height (grass field)

    // If Bobby hits the left or right wall, reverse x direction
    if (this.bobbyPosition.x <= 0 || this.bobbyPosition.x >= canvasWidth) {
      this.bobbyVelocity.x = -this.bobbyVelocity.x;
      // Change direction randomly when hitting a wall
      this.bobbyDirection = Math.random() * Math.PI * 2; // New random direction
      this.bobbyVelocity.x = this.bobbySpeed * Math.cos(this.bobbyDirection); // Update x velocity based on new direction
      this.bobbyVelocity.y = this.bobbySpeed * Math.sin(this.bobbyDirection); // Update y velocity based on new direction
    }

    // If Bobby hits the top or bottom wall, reverse y direction
    if (this.bobbyPosition.y <= 0 || this.bobbyPosition.y >= canvasHeight) {
      this.bobbyVelocity.y = -this.bobbyVelocity.y;
      // Change direction randomly when hitting a wall
      this.bobbyDirection = Math.random() * Math.PI * 2; // New random direction
      this.bobbyVelocity.x = this.bobbySpeed * Math.cos(this.bobbyDirection); // Update x velocity based on new direction
      this.bobbyVelocity.y = this.bobbySpeed * Math.sin(this.bobbyDirection); // Update y velocity based on new direction
    }

    // Update Bobby's position on screen
    console.log("Bobby Position: ", this.bobbyPosition);
  }

  updateCurrentTagger() {
    // Get current positions
    const player = {
      x: this.playerPosition.x,
      y: this.playerPosition.y,
      width: 50,
      height: 50
    };

    const bobby = {
      x: this.bobbyPosition.x,
      y: this.bobbyPosition.y,
      width: 50,
      height: 50
    };

    // Check if player touches Bobby
    if (this.checkCollision(player, bobby)) {
      if (!this.bobbyTagged) {
        this.bobbyTagged = true;
        this.playerTagged = false;
        displayMessage("Referee: Bobby is tagged!");
      } else if (!this.playerTagged) {
        this.playerTagged = true;
        this.bobbyTagged = false;
        displayMessage("Referee: Player is tagged!");
      }
    }

    // Update character colors based on tag state
    this.objects.forEach(obj => {
      if (obj.data.id === "Bobby") {
        obj.data.color = this.bobbyTagged ? "red" : "default";
      }
      if (obj.data.id === "Randy") {
        obj.data.color = this.playerTagged ? "red" : "default";
      }
    });
  }

  gameLoop() {
    // Update Bobby's position
    this.updateBobbyPosition();

    // Update current tagger
    this.updateCurrentTagger();

    // Update player position from the actual player object
    const playerObject = this.objects.find(obj => obj.data.id === "Randy");
    if (playerObject) {
      this.playerPosition.x = playerObject.position.x;
      this.playerPosition.y = playerObject.position.y;
    }

    // Continue the game loop
    requestAnimationFrame(this.gameLoop);
  }

  // Helper function to check collision between two objects
  checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }
}

//export default GameLevelGrass;