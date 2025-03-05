import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';
import Background from './Background.js';
import Player from './Player.js';
import Npc from './Npc.js';

class GameLevelGrass {
  constructor(path) {
    // Background data
    let width = GameEnv.innerWidth;
    let height = GameEnv.innerHeight;

    // Use site.baseurl for image paths
    const img_src_grass = path + "/images/rpg/spritesheet (grass).png";
    const image_data_grass = {
      name: 'Grass',
      greeting: "Welcome to the grass field! The grass is smooth, the stakes are high, and it's time for some intense tag play ",
      src: img_src_grass,
      pixels: { height: height , width: width }
    };

    //Data for Player
    const sprite_src_Randy = path + "/images/rpg/player_spritesheet.png";
    const RANDY_SCALE_FACTOR = 6; // Original value
    this.sprite_data_Randy = {
      id: 'Randy',
      greeting: "Hey there, Im Randy. Ready for some tag?",
      src: sprite_src_Randy,
      SCALE_FACTOR: RANDY_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: {x:50, y: 50},
      pixels: {height: 384, width: 512},
      orientation: {rows: 4, columns: 3},
      down: {row: 0, start: 0, columns: 3 },
      left: {row: 2, start: 0, columns: 3 },
      right: {row: 1, start: 0, columns: 3 },
      up: {row: 3, start: 0, columns: 3 },
      hitbox: { widthPercentage: 1, heightPercentage: 1 },
      keypress: { up: 87, left: 65, down: 83, right: 68 } // W=87, A=65, S=83, D=68
    };

    // Data for NPC (Bobby) playing against the player
    const sprite_src_Bobby = path + "/images/rpg/bobbynpc.png";
    const BOBBY_SCALE_FACTOR = 6; // Original value
    this.sprite_data_Bobby = {
      id: 'Bobby',
      greeting: "Whats up! I am bobby, lets play tag!",
      src: sprite_src_Bobby,
      SCALE_FACTOR: BOBBY_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 200, y: 200 },
      pixels: { height: 384, width: 512 },
      orientation: { rows: 3, start: 0, columns: 4 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
    };

    //Data for the "Paul" helper NPC
    const sprite_src_Paul = "/images/rpg/paulnpc.png";
    const PAUL_SCALE_FACTOR = 6; // Original value
    this.sprite_data_Paul = {
      id: 'Paul',
      greeting: "Hey, Im Paul, i'll increase your speed for you!",
      src: sprite_src_Paul,
      SCALE_FACTOR: PAUL_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: {x: 1000, y: 300},
      pixels: {height: 384, width: 512},
      orientation: {rows: 4, columns: 3},
      orientation: {rows: 3, start: 0, columns: 4},
      hitbox: {widthPercentage : 0.25, heightPercentage: 0.25},
      
      interact: function() {
        alert(this.greeting);
        this.sprite_data_Randy.STEP_FACTOR *= 1.5;
        alert("Your speed has been increased!");
      }
    };

    // Initialize game objects
    const gameObjects = [
      { class: Background, data: image_data_grass },
      { class: Player, data: this.sprite_data_Randy },
      { class: Npc, data: this.sprite_data_Bobby },
      { class: Npc, data: this.sprite_data_Paul }
    ];

    // Assign gameObjects to this.objects
    this.objects = gameObjects;

    // Bobby's position and movement properties
    this.bobbyPosition = { x: this.sprite_data_Bobby.INIT_POSITION.x, y: this.sprite_data_Bobby.INIT_POSITION.y };
    this.bobbyVelocity = { x: 5, y: 5 }; // Speed at which Bobby moves in the x and y direction
    this.bobbyDirection = Math.random() * Math.PI * 2; // Random starting direction (angle)
    this.bobbySpeed = 2; // Bobby's movement speed
    
    // Handle Bobby's movement and bouncing off walls
    this.updateBobbyPosition = this.updateBobbyPosition.bind(this);
    this.gameLoop = this.gameLoop.bind(this);

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

  updateCurrenttagger() {
      
    let bobby = {
      x: this.bobbyPosition.x,
      y: this.bobbyPosition.y,
      width: 50,
      height: 50
    };

      let player = {
        x: this.playerPosition.x,
        y: this.playerPosition.y,
        width: 50,
        height: 50
    };

    // Check if player touches Bobby
    if (this.checkCollision(player, bobby)) {
      if (!this.bobbyTagged) {
        this.bobbyTagged = true;
        this.playerTagged = false; // Player is not tagged initially
        alert("Referee: Bobby is tagged!");
      } else if (!this.playerTagged) {
        this.playerTagged = true;
        this.bobbyTagged = false; // Bobby is no longer tagged
        alert("Referee: Player is tagged!");
      }
    }

    // Update character colors based on tag state
    this.objects.forEach(obj => {
      if (obj.data.id === "Bobby") {
        this.ctx.save();
        this.ctx.lineWidth = 10; // Much thicker border
        this.ctx.strokeStyle = 'rgba(0, 100, 0, 1)'; // Dark green color
        this.ctx.strokeRect(2, 2, this.canvas.width - 4, this.canvas.height - 4); // Inset slightly to ensure visibility
      } else {
        this.ctx.save();
        this.ctx.lineWidth = 0; // Remove green outline if Bobby isn't tagged
      }
      if (obj.data.id === "Randy") {
        this.ctx.save();
        this.ctx.lineWidth = 10; // Much thicker border
        this.ctx.strokeStyle = 'rgba(0, 100, 0, 1)'; // Dark green color
        this.ctx.strokeRect(2, 2, this.canvas.width - 4, this.canvas.height - 4); // Inset slightly to ensure visibility
      }else {
        this.ctx.save();
        this.ctx.lineWidth = 0; // Remove green outline if Randy isn't tagged
      }
    });

    // Continue the game loop
    requestAnimationFrame(this.gameLoop);
  }

  gameLoop() {
    // Start Bobby's movement
    this.updateBobbyPosition();

    // Assume we have access to player position
    let player = {
      x: this.objects.find(obj => obj.data.id === "Randy").data.INIT_POSITION.x,
      y: this.objects.find(obj => obj.data.id === "Randy").data.INIT_POSITION.y,
      width: 50, // Approximate width
      height: 50 // Approximate height
    };

  
  }

  // Helper function to check collision between two objects
  checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }
}

export default GameLevelGrass;