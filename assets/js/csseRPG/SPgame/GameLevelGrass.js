import GameEnv from '../../adventureGame/GameEnv.js';
import Background from '../../adventureGame/Background.js';
import Player from '../../adventureGame/Player.js';
import Npc from './Npc.js';

class GameLevelGrass {
  constructor(path) {
    // Background data
    let width = path.innerWidth;
    let height = path.innerHeight;
    let path = path.path;

    const img_src_grass = path + "/SPgame/images/rpg/spritesheet (grass).png";
    const image_data_grass = {
      name: 'Grass',
      greeting: "Welcome to the grass field! The grass is smooth, the stakes are high, and it's time for some intense tag play ",
      src: img_src_grass,
      pixels: { height: 580, width: 1038 }
    };

    //Data for Player
    const sprite_src_Randy = path + "/SPgame/images/rpg/spritesheet.png";
    const RANDY_SCALE_FACTOR = 3;
    const sprite_data_Randy = {
      id: 'Randy',
      greeting: "Hey there, Im Randy. Ready for some tag?",
      src: sprite_src_Randy,
      SCALE_FACTOR: RANDY_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: {x:50, y: 50},
      pixels: {height: 384, width: 512},
      orientation: {rows: 3, columns: 4},
      down: {row: 0, start: 0, columns: 3 },
      left: {row: 2, start: 0, columns: 3 },
      right: {row: 1, start: 0, columns: 3 },
      up: {row: 3, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 95, left: 73, down: 93, right: 78 }
    };

    // Data for NPC (Bobby) playing against the player
    const sprite_src_Bobby = path + "/SPgame/images/rpg/pixil-frame-0.png";
    const BOBBY_SCALE_FACTOR = 5;
    const sprite_data_Bobby = {
      id: 'Bobby',
      greeting: "Whats up! I am bobby, lets play tag!",
      src: sprite_src_Bobby,
      SCALE_FACTOR: BOBBY_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 200, y: 200 }, // Initial position on screen
      pixels: { height: 384, width: 512 },
      orientation: { rows: 3, start: 0, columns: 4 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
    };

    //Data for the "Paul" helper NPC
    const sprite_src_Paul = path + "/SPgame/images/rpg/paulnpc.png";
    const PAUL_SCALE_FACTOR = 5;
    const sprite_data_Paul = {
      id: 'Paul',
      greeting: "Hey, Im Paul, i'll increase your speed for you!",
      src: sprite_src_Paul,
      SCALE_FACTOR: PAUL_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: {x: 400, y: 100},
      pixels: {x: (width/2), y: (height/2) },
      orientation: {rows: 3, start: 0, columns: 4},
      hitbox: {widthPercentage : 0.25, heightPercentage: 0.25}
    };
    
    //Data for the "Shayan" helper NPC
    const sprite_src_Shayan = path + "/SPgame/images/rpg/shayannpc.png";
    const SHAYAN_SCALE_FACTOR = 5;
    const sprite_data_Shayan = {
      id: 'Shayan',
      greeting: "Hey, Im Shayan, here's a power boost!",
      src: sprite_src_Shayan,
      SCALE_FACTOR: SHAYAN_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: {x: 300, y: 100},
      pixels: {x: 384, y: 512},
      orientation: {rows: 3, start: 0, columns: 4},
      hitbox: {widthPercentage : 0.25, heightPercentage: 0.25}
    };

    //Data for the "Referee" helper NPC
    const sprite_src_referee = path + "/SPgame/images/rpg/spritesheet (1).png";
    const REFEREE_SCALE_FACTOR = 5;
    const sprite_data_referee = {
      id: 'Referee',
      src: sprite_src_referee,
      SCALE_FACTOR: REFEREE_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: {x: 400, y: 250},
      pixels: {x: 384, y: 512},
      orientation: {rows: 3, start: 0, columns: 4},
    };

    // Bobby's position and movement properties
    this.bobbyPosition = { x: sprite_data_Bobby.INIT_POSITION.x, y: sprite_data_Bobby.INIT_POSITION.y };
    this.bobbyVelocity = { x: 2, y: 2 }; // Speed at which Bobby moves in the x and y direction
    this.bobbyDirection = Math.random() * Math.PI * 2; // Random starting direction (angle)
    this.bobbySpeed = 2; // Bobby's movement speed
    
    // Handle Bobby's movement and bouncing off walls
    this.updateBobbyPosition = this.updateBobbyPosition.bind(this);

    // Call updateBobbyPosition every frame
    this.gameLoop();
  

  // Update Bobby's position and make him bounce off the walls
  updateBobbyPosition() 
  {
    // Move Bobby in the direction he's facing
    this.bobbyPosition.x += this.bobbyVelocity.x;
    this.bobbyPosition.y += this.bobbyVelocity.y;
    
    // Check for collisions with walls (bouncing logic)
    const canvasWidth = 1038; // Canvas width (grass field)
    const canvasHeight = 580; // Canvas height (grass field)

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

    // Update Bobby's position on screen (you can use this in your rendering code)
    console.log("Bobby Position: ", this.bobbyPosition);
  }
  



  // Main game loop
  //ameLoop() {
    this.updateBobbyPosition(); // Update Bobby's position every frame

    // Call gameLoop on the next frame
    requestAnimationFrame(this.gameLoop); // Repeat the game loop for continuous animation
  
    this.classes = [
    { class: Background, data: image_data_grass },
    { class: Player, data: sprite_data_Randy },
    { class: Npc, data: sprite_data_Bobby },
    { class: Npc, data: sprite_data_Paul },
    { class: Npc, data: sprite_data_Shayan },
    { class: Npc, data: sprite_data_referee},
    ];
  }
  
}



export default GameLevelGrass;