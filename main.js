import Platform from "./classes/Platform.js";
import BackgroundObject from "./classes/BackgroundObject.js";
import Player from "./classes/Player.js";
import FireBall from "./classes/FireBall.js";
import PowerObject from "./classes/PowerObject.js";
import ObstacleObject from "./classes/ObstacleObject.js";
import WinFlag from "./classes/WinFlag.js";
import {
  checkCollision,
  checkObjectOnTop,
  isWithinBounds,
  CreateImage,
} from "./utils.js";

const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

const context = canvas.getContext("2d");

const platform = "./Tiles/bigPlatform.png";
const platform1 = "./Tiles/midPlatform.png";
const platform2 = "./Tiles/smallPlatform.png";
const bg = "./BG/BG.png";
const gravity = 1.5;

let player;
let Flag;
let bigPlatform;
let midPlatform;
let smallPlatform;
let fireBalls = [];
let platforms = [];
let backgroundObjects = [];
let obstacleObjects = [];
let powerObjects = [];
let lastKey;
let lengthCovered;
let scoreBoard = 140;
let upKeyHeld = false;
let playerPowerUp = false;
let fireBallPushed = false;
let hi_score;
//24 for the canvas width deduction as it has 1024w and background image has 1000w,taking product of one less background images of the array and (rounding it to its floor; here round off is taken w.r.to lengthCovered=+-3 ie(3) if necessary)
const backgroundWidth = CreateImage(bg).width * 3 - 24;
const playerSprite = {
  stand: {
    cropXr: 250,
    cropXl: 130,
    cropY: 40,
    right: [
      CreateImage("./player/right/Idle (1).png"),
      CreateImage("./player/right/Idle (2).png"),
      CreateImage("./player/right/Idle (3).png"),
      CreateImage("./player/right/Idle (4).png"),
      CreateImage("./player/right/Idle (5).png"),
      CreateImage("./player/right/Idle (6).png"),
      CreateImage("./player/right/Idle (7).png"),
      CreateImage("./player/right/Idle (8).png"),
      CreateImage("./player/right/Idle (9).png"),
      CreateImage("./player/right/Idle (10).png"),
    ],
    left: [
      CreateImage("./player/left/Idle (1).png"),
      CreateImage("./player/left/Idle (2).png"),
      CreateImage("./player/left/Idle (3).png"),
      CreateImage("./player/left/Idle (4).png"),
      CreateImage("./player/left/Idle (5).png"),
      CreateImage("./player/left/Idle (6).png"),
      CreateImage("./player/left/Idle (7).png"),
      CreateImage("./player/left/Idle (8).png"),
      CreateImage("./player/left/Idle (9).png"),
      CreateImage("./player/left/Idle (10).png"),
    ],
    rightP: [
      CreateImage("./player/right/IdleP (1).png"),
      CreateImage("./player/right/IdleP (2).png"),
      CreateImage("./player/right/IdleP (3).png"),
      CreateImage("./player/right/IdleP (4).png"),
      CreateImage("./player/right/IdleP (5).png"),
      CreateImage("./player/right/IdleP (6).png"),
      CreateImage("./player/right/IdleP (7).png"),
      CreateImage("./player/right/IdleP (8).png"),
      CreateImage("./player/right/IdleP (9).png"),
      CreateImage("./player/right/IdleP (10).png"),
    ],
    leftP: [
      CreateImage("./player/left/IdleP (1).png"),
      CreateImage("./player/left/IdleP (2).png"),
      CreateImage("./player/left/IdleP (3).png"),
      CreateImage("./player/left/IdleP (4).png"),
      CreateImage("./player/left/IdleP (5).png"),
      CreateImage("./player/left/IdleP (6).png"),
      CreateImage("./player/left/IdleP (7).png"),
      CreateImage("./player/left/IdleP (8).png"),
      CreateImage("./player/left/IdleP (9).png"),
      CreateImage("./player/left/IdleP (10).png"),
    ],
  },
  run: {
    cropXr: 240,
    cropXl: 140,
    cropY: 30,
    right: [
      CreateImage("./player/right/Run (1).png"),
      CreateImage("./player/right/Run (2).png"),
      CreateImage("./player/right/Run (3).png"),
      CreateImage("./player/right/Run (4).png"),
      CreateImage("./player/right/Run (5).png"),
      CreateImage("./player/right/Run (6).png"),
      CreateImage("./player/right/Run (7).png"),
      CreateImage("./player/right/Run (8).png"),
    ],
    left: [
      CreateImage("./player/left/Run (1).png"),
      CreateImage("./player/left/Run (2).png"),
      CreateImage("./player/left/Run (3).png"),
      CreateImage("./player/left/Run (4).png"),
      CreateImage("./player/left/Run (5).png"),
      CreateImage("./player/left/Run (6).png"),
      CreateImage("./player/left/Run (7).png"),
      CreateImage("./player/left/Run (8).png"),
    ],
    rightP: [
      CreateImage("./player/right/RunP (1).png"),
      CreateImage("./player/right/RunP (2).png"),
      CreateImage("./player/right/RunP (3).png"),
      CreateImage("./player/right/RunP (4).png"),
      CreateImage("./player/right/RunP (5).png"),
      CreateImage("./player/right/RunP (6).png"),
      CreateImage("./player/right/RunP (7).png"),
      CreateImage("./player/right/RunP (8).png"),
    ],
    leftP: [
      CreateImage("./player/left/RunP (1).png"),
      CreateImage("./player/left/RunP (2).png"),
      CreateImage("./player/left/RunP (3).png"),
      CreateImage("./player/left/RunP (4).png"),
      CreateImage("./player/left/RunP (5).png"),
      CreateImage("./player/left/RunP (6).png"),
      CreateImage("./player/left/RunP (7).png"),
      CreateImage("./player/left/RunP (8).png"),
    ],
  },
};
const keys = {
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};
/**
 * Checks if the current score is a high score and performs actions accordingly.
 * @param {number} score - The current score.
 * @param {HiScoreStatus} [destination="not_reached"] - The destination status after reaching high score.
 */
function CheckHiScore(score, destination = "not_reached") {
  scoreBoard = 140;
  keys.left.pressed = false;
  keys.right.pressed = false;
  playerPowerUp = false;
  const Hi_score = sessionStorage.getItem("highScore");

  if ((!Hi_score || score > Hi_score) && score > 140) {
    sessionStorage.setItem("highScore", score);
    if (destination === "reached") {
      alert("You completed the game with a high score!!");
    } else {
      alert("You scored a Hi-Score");
    }
  } else if (destination === "reached") {
    alert("You completed the game!!");
  }

  init();
}
/**
 * Initializes the game.
 */
function init() {
  hi_score = sessionStorage.getItem("highScore");
  player = new Player(playerSprite, gravity, canvas, context);
  Flag = new WinFlag({
    position: { x: 5930, y: 340 },
    image: CreateImage("./Object/flag.png"),

    gravity,
    canvas,
    context,
  });
  backgroundObjects = [
    new BackgroundObject({
      position: { x: 0, y: 0 },
      width: CreateImage(bg).width,
      height: CreateImage(bg).height,
      image: CreateImage(bg),
      context,
    }),
    new BackgroundObject({
      position: { x: CreateImage(bg).width, y: -1 },
      width: CreateImage(bg).width,
      height: CreateImage(bg).height,
      image: CreateImage(bg),
      context,
    }),
    new BackgroundObject({
      position: { x: CreateImage(bg).width * 2, y: -1 },
      width: CreateImage(bg).width,
      height: CreateImage(bg).height,
      image: CreateImage(bg),
      context,
    }),
    new BackgroundObject({
      position: { x: CreateImage(bg).width * 3, y: -1 },
      width: CreateImage(bg).width,
      height: CreateImage(bg).height,
      image: CreateImage(bg),
      context,
    }),
  ];
  bigPlatform = CreateImage(platform);
  midPlatform = CreateImage(platform1);
  smallPlatform = CreateImage(platform2);
  platforms = [
    new Platform({
      position: { x: 0, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 2, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),

    new Platform({
      position: { x: bigPlatform.width * 2 + 12, y: 92 },
      width: smallPlatform.width,
      height: smallPlatform.height,
      image: smallPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 3 + 41, y: 420 },
      width: smallPlatform.width,
      height: smallPlatform.height,
      image: smallPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 3, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 4, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 5, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 6, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 7, y: 410 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 7, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 8, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 9, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 10, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 11, y: 410 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 11, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 12, y: 330 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 12, y: 410 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 12, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 15 - 15, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 15 - 7, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 16 - 7, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 18.8, y: 540 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 19.8, y: 540 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 20.8, y: 540 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 21.8, y: 540 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 22.8, y: 540 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 23.8, y: 540 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 18.4, y: 360 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 19.4, y: 360 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 20.4, y: 360 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 21.4, y: 360 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 22.4, y: 360 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 23.4, y: 360 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 24.4, y: 360 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 27 - 13, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 28 - 13, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 29 - 13, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 30 - 13, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 32.6 - 23, y: 390 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 35 - 23, y: 360 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 37.8 - 40, y: 390 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 40.7 - 50, y: 490 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: bigPlatform.width * 42.55 - 30, y: 162 },
      width: smallPlatform.width,
      height: smallPlatform.height,
      image: smallPlatform,
      context,
    }),

    new Platform({
      position: { x: bigPlatform.width * 42.55 + 27, y: 537 },
      width: smallPlatform.width,
      height: smallPlatform.height,
      image: smallPlatform,
      context,
    }),

    new Platform({
      position: { x: bigPlatform.width * 45 + 98, y: 430 },
      width: bigPlatform.width,
      height: bigPlatform.height,
      image: bigPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 44 + 96, y: 536 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
    new Platform({
      position: { x: midPlatform.width * 45 + 96, y: 536 },
      width: midPlatform.width,
      height: midPlatform.height,
      image: midPlatform,
      context,
    }),
  ];
  obstacleObjects = [
    new ObstacleObject({
      position: { x: 850, y: 200 },
      image: CreateImage("./Object/obstacle.png"),

      gravity,
      canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 1625, y: 200 },
      image: CreateImage("./Object/obstacle.png"),

      gravity,
      canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 1955, y: 200 },
      image: CreateImage("./Object/obstacle.png"),

      gravity,
      canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 3030, y: 200 },
      image: CreateImage("./Object/obstacle.png"),

      gravity,
      canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 3210, y: 200 },
      image: CreateImage("./Object/obstacle.png"),

      gravity,
      canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 2880, y: 400 },
      image: CreateImage("./Object/obstacle.png"),

      gravity,
      canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 3140, y: 400 },
      image: CreateImage("./Object/obstacle.png"),

      gravity,
      canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 4500, y: 200 },
      image: CreateImage("./Object/obstacle.png"),

      gravity,
      canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 4840, y: 200 },
      image: CreateImage("./Object/obstacle.png"),

      gravity,
      canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 5755, y: 470 },
      image: CreateImage("./Object/obstacle.png"),

      gravity,
      canvas,
      context,
    }),
  ];
  powerObjects = [
    new PowerObject({
      position: { x: 265, y: 0 },
      image: CreateImage("./Object/Mushroom_1.png"),

      gravity,
      canvas,
      context,
    }),
    new PowerObject({
      position: { x: 3000, y: 400 },
      image: CreateImage("./Object/Mushroom_1.png"),

      gravity,
      canvas,
      context,
    }),
    new PowerObject({
      position: { x: 5410, y: 50 },
      image: CreateImage("./Object/Mushroom_1.png"),

      gravity,
      canvas,
      context,
    }),
  ];
  lengthCovered = 0;
}

/**
 *Animates the game by updating and drawing various game objects on the canvas.
 */
function animate() {
  requestAnimationFrame(animate);
  /**
   *Clears the canvas and sets the background color.
   */
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  /**
   *Draws background objects that are within the canvas bounds.
   */
  backgroundObjects.forEach((backgroundObject) => {
    if (isWithinBounds(backgroundObject, canvas)) {
      backgroundObject.draw();
    }
  });
  /**
   *Sets the text style and displays the score and hi-score if conditions are met.
   */

  context.fillStyle = "black";
  context.font = "25px Arial";

  if (hi_score && hi_score > 140) {
    context.fillText(`Hi-Score:${hi_score}`, canvas.width - 350, 30);
  }

  context.fillText(`Score:${scoreBoard}`, canvas.width - 160, 30);
  /**
   *Draws platforms that are within the canvas bounds.
   */
  platforms.forEach((platform) => {
    if (isWithinBounds(platform, canvas)) {
      platform.draw();
    }
  });
  /**

*Updates and draws the flag object if it is within the canvas bounds.
*/

  if (isWithinBounds(Flag, canvas)) {
    Flag.updateDraw();
  }
  /**
   *Updates and draws power objects that are within the canvas bounds.
   */
  powerObjects.forEach((powerObject) => {
    if (isWithinBounds(powerObject, canvas)) {
      powerObject.updateDraw();
    }
  });
  /**

*Updates and draws obstacle objects that are within the canvas bounds.
*/
  obstacleObjects.forEach((obstacleObject, index) => {
    if (obstacleObject.position.y + obstacleObject.height > canvas.height) {
      obstacleObject.visible = false;
    }
    if (obstacleObject.visible && isWithinBounds(obstacleObject, canvas)) {
      switch (index) {
        case 0:
        case 1:
          obstacleObject.movement.x = -1;
          break;
        case 3:
          obstacleObject.movement.x = -2;
          break;
        case 4:
          obstacleObject.movement.x = -3;
          break;
      }

      obstacleObject.updateDraw();
    }
  });

  /**
   *Updates and removes fire balls based on their position and range.
   *Also updates the remaining fire balls.
   */
  fireBalls.forEach((fireBall, index) => {
    if (
      (lastKey === "left" && fireBall.position.x <= fireBall.range - 200) ||
      (lastKey === "right" &&
        fireBall.position.x + fireBall.width >= fireBall.range + 200)
    ) {
      fireBalls.splice(index, 1);
    } else {
      fireBall.update();
    }
  });
  /**
   *Updates and draws the player object.
   */
  player.updateDraw();

  handlePlayerMovement();

  handlePlatformCollision();

  handlePowerObjectCollision();

  handleObstacleCollision();

  handlePlayerSpriteChange();

  checkFlagCollision();

  handleFireballMovement();

  // Checks if the player is off the platform or not.
  if (player.position.y + player.height > canvas.height) {
    CheckHiScore(scoreBoard);
  }
}

init();

animate();

/**
 * Handles platform collision detection with various objects.
 */
function handlePlatformCollision() {
  platforms.forEach((platform) => {
    if (checkObjectOnTop(player, platform)) {
      // Stop player's vertical movement and set player on the ground
      player.movement.y = 0;
      player.isPlayerOnGround = true;
    }
    if (checkObjectOnTop(Flag, platform)) {
      // Stop Flag's vertical movement
      Flag.movement.y = 0;
    }
    powerObjects.forEach((powerObject) => {
      if (checkObjectOnTop(powerObject, platform)) {
        // Stop power object's vertical movement
        powerObject.movement.y = 0;
      }
    });
    obstacleObjects.forEach((obstacleObject) => {
      if (checkObjectOnTop(obstacleObject, platform)) {
        // Stop obstacle object's vertical movement
        obstacleObject.movement.y = 0;
      }
    });
  });
}

/**
 *Handles player movement based on user input.
 */
function handlePlayerMovement() {
  if (
    (keys.left.pressed &&
      player.position.x > 100 &&
      lengthCovered < backgroundWidth) ||
    (keys.left.pressed && lengthCovered === 0 && player.position.x > 0)
  ) {
    // Decrease score and move player to the left
    scoreBoard -= 5;
    player.movement.x = -5;
  } else if (
    (keys.right.pressed &&
      player.position.x + player.width < 400 &&
      lengthCovered < backgroundWidth) ||
    (keys.right.pressed &&
      lengthCovered === backgroundWidth &&
      player.position.x + player.width < canvas.width)
  ) {
    // Increase score and move player to the right
    player.movement.x = +5;
    scoreBoard += 5;
  } else {
    player.movement.x = 0;
    if (
      keys.left.pressed &&
      lengthCovered <= backgroundWidth &&
      player.position.x + player.width >= 400
    ) {
      // Decrease score and move player to the left
      scoreBoard -= 5;
      player.movement.x = -5;
    }
    if (
      keys.left.pressed &&
      lengthCovered > 0 &&
      lengthCovered <= backgroundWidth &&
      player.position.x + player.width < 400
    ) {
      // Decrease score, move player to the left, and adjust positions of other objects
      scoreBoard -= 5;
      lengthCovered -= 3;
      backgroundObjects.forEach((backgroundObject) => {
        backgroundObject.position.x += 3;
      });
      Flag.position.x += 5;
      obstacleObjects.forEach((obstacleObject) => {
        obstacleObject.position.x += 5;
      });
      powerObjects.forEach((powerObject) => {
        powerObject.position.x += 5;
      });
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
      fireBalls.forEach((fireBall) => {
        fireBall.position.x += 5;
      });
    } else if (keys.right.pressed && lengthCovered < backgroundWidth) {
      // Increase score, move player to the right, and adjust positions of other objects
      scoreBoard += 5;
      lengthCovered += 3;
      backgroundObjects.forEach((backgroundObject) => {
        backgroundObject.position.x -= 3;
      });
      Flag.position.x -= 5;
      obstacleObjects.forEach((obstacleObject) => {
        obstacleObject.position.x -= 5;
      });
      powerObjects.forEach((powerObject) => {
        powerObject.position.x -= 5;
      });
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
      fireBalls.forEach((fireBall) => {
        fireBall.position.x -= 5;
      });
    }
  }
}

/**
 *Handles the change of player sprite based on key inputs and current state.
 *Updates the player's current sprite, crop coordinates, and power-up state accordingly.
 */
function handlePlayerSpriteChange() {
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprite.run.right
  ) {
    player.currentSprite = playerPowerUp
      ? player.sprite.run.rightP
      : player.sprite.run.right;
    player.currentCropX = player.sprite.run.cropXr;
    player.currentCropY = player.sprite.run.cropY;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprite.run.left
  ) {
    player.currentSprite = playerPowerUp
      ? player.sprite.run.leftP
      : player.sprite.run.left;

    player.currentCropX = player.sprite.run.cropXl;
    player.currentCropY = player.sprite.run.cropY;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprite.stand.left
  ) {
    player.currentSprite = playerPowerUp
      ? player.sprite.stand.leftP
      : player.sprite.stand.left;
    player.currentCropX = player.sprite.stand.cropXl;
    player.currentCropY = player.sprite.stand.cropY;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprite.stand.right
  ) {
    player.currentSprite = playerPowerUp
      ? player.sprite.stand.rightP
      : player.sprite.stand.right;
    player.currentCropX = player.sprite.stand.cropXr;
    player.currentCropY = player.sprite.stand.cropY;
  }
}

/**
*Handles the movement of fireballs based on player power-up and key inputs.

*If the player is powered up and the space key is pressed, a fireball is created and pushed into the fireBalls array.

*The fireball's position and movement are determined based on the player's position and direction.

*This function also ensures that only one fireball is pushed at a time by using the fireBallPushed flag.
*/
function handleFireballMovement() {
  if (playerPowerUp && !fireBallPushed && keys.space.pressed) {
    if (lastKey === "right") {
      fireBalls.push(
        new FireBall({
          position: {
            x: player.position.x + player.width,
            y: player.position.y + player.height / 1.45,
          },
          movement: { x: 10, y: 0 },
          context,
        })
      );
    } else if (lastKey === "left") {
      fireBalls.push(
        new FireBall({
          position: {
            x: player.position.x,
            y: player.position.y + player.height / 1.45,
          },
          movement: { x: -10, y: 0 },
          context,
        })
      );
    }
    fireBallPushed = true;
  }
}

/**
*Handles the collision between the player and power objects.

*Checks for collision between the player and each power object in the powerObjects array.

*If a collision is detected and the power object is visible, it is consumed by the player.

*The power object's visibility is set to false, playerPowerUp flag is set to true, and the scoreBoard is increased by 1000.

*Player is then able to throw Fireball by pressing space bar.
*/
function handlePowerObjectCollision() {
  powerObjects.forEach((powerObject) => {
    if (checkCollision(player, powerObject)) {
      if (powerObject.visible) {
        powerObject.visible = false;
        playerPowerUp = true;
        scoreBoard += 1000;
      }
    }
  });
}

/**

*Handles the collision between the player and obstacle objects.

*Checks for collision between the player and each obstacle object in the obstacleObjects array.

*If the obstacle object is visible, it checks for collision with fire balls.

*If a collision is detected, the corresponding fire ball is removed, scoreBoard is increased by 500, and the obstacle object is made invisible.

*It also checks if the player is on top of the obstacle object, in which case it sets the isPlayerOnObstacle flag to true and increases the scoreBoard by 500.

*If there is a collision between the player and the obstacle object, it handles different cases:

*If the player is on top of the obstacle, the obstacle object is made invisible.

*If the player is colliding with the obstacle and the player has a power-up, the obstacle object is made invisible, the player loses the power-up, and the scoreBoard is decreased by 800.

*If the obstacle object is visible, it calls the CheckHiScore function with the current scoreBoard value.
*/
function handleObstacleCollision() {
  obstacleObjects.forEach((obstacleObject) => {
    if (obstacleObject.visible) {
      fireBalls.forEach((fireBall, index) => {
        if (checkCollision(fireBall, obstacleObject)) {
          fireBalls.splice(index, 1);
          scoreBoard += 500;
          obstacleObject.visible = false;
          return;
        }
      });
    }

    if (checkObjectOnTop(player, obstacleObject)) {
      obstacleObject.isPlayerOnObstacle = true;

      scoreBoard += 500;
    }

    if (checkCollision(player, obstacleObject)) {
      if (obstacleObject.isPlayerOnObstacle) {
        obstacleObject.visible = false;
        return;
      }
      if (obstacleObject.visible && playerPowerUp) {
        obstacleObject.visible = false;
        playerPowerUp = false;
        scoreBoard -= 800;
      }
      obstacleObject.visible && CheckHiScore(scoreBoard);
    }
  });
}

/**
 *Checks for collision between the player and the flag.
 *If a collision is detected, it updates the hi-score based on the current score.
 */
function checkFlagCollision() {
  if (checkCollision(player, Flag)) {
    CheckHiScore(scoreBoard, "reached");
  }
}

document.addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "ArrowUp":
      if (!upKeyHeld && player.isPlayerOnGround) {
        player.movement.y -= 26;
        upKeyHeld = true;
        player.isPlayerOnGround = false;
      }
      break;
    case "ArrowLeft":
      keys.left.pressed = true;
      lastKey = "left";

      break;
    case "ArrowRight":
      keys.right.pressed = true;
      lastKey = "right";

      break;
    case "Space":
      keys.space.pressed = true;

      break;
  }
});

document.addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "ArrowUp":
      upKeyHeld = false;
      break;
    case "ArrowLeft":
      keys.left.pressed = false;
      break;
    case "ArrowRight":
      keys.right.pressed = false;
      break;
    case "Space":
      keys.space.pressed = false;
      fireBallPushed = false;
      break;
  }
});
