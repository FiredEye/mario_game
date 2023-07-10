import Platform from "../classes/Platform.js";
import BackgroundObject from "../classes/BackgroundObject.js";
import Player from "../classes/player.js";
import FireBall from "../classes/FireBall.js";
import PowerObject from "../classes/PowerObject.js";
import ObstacleObject from "../classes/ObstacleObject.js";
import WinFlag from "../classes/WinFlag.js";
import {
  checkCollision,
  checkObjectOnTop,
  isWithinBounds,
  CreateImage,
  CreateNewDate,
} from "./utils.js";
import { sharedData, keys, playerSprite } from "./shared.js";

sharedData.canvas.width = 1024;
sharedData.canvas.height = 576;

const context = sharedData.canvas.getContext("2d");

const gravity = 1.5;
let player;
let bgImg;
let obstacleImg;
let powerUpImg;
let Flag;
let bigPlatform;
let midPlatform;
let smallPlatform;
let fireBalls = [];
let platforms = [];
let backgroundObjects = [];
let obstacleObjects = [];
let powerObjects = [];

let lengthCovered;

let upKeyHeld = false;
let fireBallPushed = false;
let hi_score, playerName, playerScore;
//24 for the sharedData.canvas width deduction as it has 1024w and background image has 1000w,taking product of one less background images of the array and (rounding it to its floor; here round off is taken w.r.to lengthCovered=+-3 ie(3) if necessary)
let backgroundWidth;

/**
 * Checks if the current score is a high score and performs actions accordingly.
 * @param {number} playScore - The current score.
 * @param {HiScoreStatus} [destination="not_reached"] - The destination status after reaching high score.
 */
function CheckHiScore(playScore, destination = "not_reached") {
  sharedData.scoreBoard = 140;
  keys.left.pressed = false;
  keys.right.pressed = false;
  sharedData.playerPowerUp = false;

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const { id, score } = userData;
  if (
    (!hi_score || playScore > hi_score || playScore > score) &&
    playScore > 140
  ) {
    if (destination === "reached") {
      alert("You completed the game with a high score!!");
    } else if (playScore > score) {
      fetch(`http://localhost:5000/api/userData/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: playScore, updated_at: CreateNewDate() }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.data) {
            sessionStorage.setItem("userData", JSON.stringify(result.data));
            alert("You Scored a personal Hi-Score");
            init();
          }
        })
        .catch((error) => console.error(error));
    }
  } else if (destination === "reached") {
    alert("You completed the game!!");
  }
  fetch(`http://localhost:5000/api/userData/lastPlayed/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updated_at: CreateNewDate() }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message) {
        init();
      }
    })
    .catch((error) => console.error(error));
}
/**
 * Initializes the game.
 */
export function init() {
  //24 for the sharedData.canvas width deduction as it has 1024w and background image has 1000w,taking product of one less background images of the array and (rounding it to its floor; here round off is taken w.r.to lengthCovered=+-3 ie(3) if necessary)
  backgroundWidth = CreateImage("/assets/images/BG/BG.png").width * 3 - 24;
  bgImg = CreateImage("/assets/images/BG/BG.png");
  obstacleImg = CreateImage("/assets/images/Object/obstacle.png");
  powerUpImg = CreateImage("/assets/images/Object/Mushroom_1.png");
  bigPlatform = CreateImage("/assets/images/Tiles/bigPlatform.png");
  midPlatform = CreateImage("/assets/images/Tiles/midPlatform.png");
  smallPlatform = CreateImage("/assets/images/Tiles/smallPlatform.png");

  const data = sessionStorage.getItem("userData");
  const { name, score } = JSON.parse(data);
  playerName = name;
  playerScore = score;
  fetch("http://localhost:5000/api/highScore")
    .then((response) => response.json())
    .then((data) => {
      if (data.largestScore) hi_score = data.largestScore;
    })
    .catch((error) => console.error(error));

  player = new Player(playerSprite, gravity, sharedData.canvas, context);
  Flag = new WinFlag({
    position: { x: 5930, y: 340 },
    image: CreateImage("/assets/images/Object/flag.png"),
    gravity,
    canvas: sharedData.canvas,
    context,
  });

  backgroundObjects = [
    new BackgroundObject({
      position: { x: 0, y: 0 },
      width: bgImg.width,
      height: bgImg.height,
      image: bgImg,
      context,
    }),
    new BackgroundObject({
      position: { x: bgImg.width, y: -1 },
      width: bgImg.width,
      height: bgImg.height,
      image: bgImg,
      context,
    }),
    new BackgroundObject({
      position: { x: bgImg.width * 2, y: -1 },
      width: bgImg.width,
      height: bgImg.height,
      image: bgImg,
      context,
    }),
    new BackgroundObject({
      position: { x: bgImg.width * 3, y: -1 },
      width: bgImg.width,
      height: bgImg.height,
      image: bgImg,
      context,
    }),
  ];

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
      image: obstacleImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 1625, y: 200 },
      image: obstacleImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 1955, y: 200 },
      image: obstacleImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 3030, y: 200 },
      image: obstacleImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 3210, y: 200 },
      image: obstacleImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 2880, y: 400 },
      image: obstacleImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 3140, y: 400 },
      image: obstacleImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 4500, y: 200 },
      image: obstacleImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 4840, y: 200 },
      image: obstacleImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new ObstacleObject({
      position: { x: 5755, y: 470 },
      image: obstacleImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
  ];
  powerObjects = [
    new PowerObject({
      position: { x: 265, y: 0 },
      image: powerUpImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new PowerObject({
      position: { x: 3000, y: 400 },
      image: powerUpImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
    new PowerObject({
      position: { x: 5410, y: 50 },
      image: powerUpImg,

      gravity,
      canvas: sharedData.canvas,
      context,
    }),
  ];
  lengthCovered = 0;
}

/**
 *Animates the game by updating and drawing various game objects on the sharedData.canvas.
 */
export function animate() {
  if (!sharedData.isPaused) {
    requestAnimationFrame(animate);
    /**
     *Clears the canvas and sets the background color.
     */
    context.fillStyle = "white";
    context.fillRect(0, 0, sharedData.canvas.width, sharedData.canvas.height);
    /**
     *Draws background objects that are within the sharedData.canvas bounds.
     */
    backgroundObjects.forEach((backgroundObject) => {
      if (isWithinBounds(backgroundObject, sharedData.canvas)) {
        backgroundObject.draw();
      }
    });
    /**
     *Sets the text style and displays the score and hi-score if conditions are met.
     */

    context.fillStyle = "black";
    context.font = "20px Arial";

    context.fillText(`Player Name:${playerName}`, 10, 30);
    context.fillText(`Personal-Score:${playerScore}`, 510, 30);

    if (hi_score && hi_score > 140) {
      context.fillText(
        `Hi-Score:${hi_score}`,
        sharedData.canvas.width - 290,
        30
      );
    }

    context.fillText(
      `Score:${sharedData.scoreBoard}`,
      sharedData.canvas.width - 130,
      30
    );
    /**
     *Draws platforms that are within the sharedData.canvas bounds.
     */
    platforms.forEach((platform) => {
      if (isWithinBounds(platform, sharedData.canvas)) {
        platform.draw();
      }
    });
    /**

*Updates and draws the flag object if it is within the sharedData.canvas bounds.
*/

    if (isWithinBounds(Flag, sharedData.canvas)) {
      Flag.updateDraw();
    }
    /**
     *Updates and draws power objects that are within the sharedData.canvas bounds.
     */
    powerObjects.forEach((powerObject) => {
      if (isWithinBounds(powerObject, sharedData.canvas)) {
        powerObject.updateDraw();
      }
    });
    /**

*Updates and draws obstacle objects that are within the sharedData.canvas bounds.
*/
    obstacleObjects.forEach((obstacleObject, index) => {
      if (
        obstacleObject.position.y + obstacleObject.height >
        sharedData.canvas.height
      ) {
        obstacleObject.visible = false;
      }
      if (
        obstacleObject.visible &&
        isWithinBounds(obstacleObject, sharedData.canvas)
      ) {
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
        (sharedData.lastKey === "left" &&
          fireBall.position.x <= fireBall.range - 200) ||
        (sharedData.lastKey === "right" &&
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
    if (player.position.y + player.height > sharedData.canvas.height) {
      CheckHiScore(sharedData.scoreBoard);
    }
  }
}

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
    sharedData.scoreBoard -= 5;
    player.movement.x = -5;
  } else if (
    (keys.right.pressed &&
      player.position.x + player.width < 400 &&
      lengthCovered < backgroundWidth) ||
    (keys.right.pressed &&
      lengthCovered === backgroundWidth &&
      player.position.x + player.width < sharedData.canvas.width)
  ) {
    // Increase score and move player to the right
    player.movement.x = +5;
    sharedData.scoreBoard += 5;
  } else {
    player.movement.x = 0;
    if (
      keys.left.pressed &&
      lengthCovered <= backgroundWidth &&
      player.position.x + player.width >= 400
    ) {
      // Decrease score and move player to the left
      sharedData.scoreBoard -= 5;
      player.movement.x = -5;
    }
    if (
      keys.left.pressed &&
      lengthCovered > 0 &&
      lengthCovered <= backgroundWidth &&
      player.position.x + player.width < 400
    ) {
      // Decrease score, move player to the left, and adjust positions of other objects
      sharedData.scoreBoard -= 5;
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
      sharedData.scoreBoard += 5;
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
    sharedData.lastKey === "right" &&
    player.currentSprite !== player.sprite.run.right
  ) {
    player.currentSprite = sharedData.playerPowerUp
      ? player.sprite.run.rightP
      : player.sprite.run.right;
    player.currentCropX = player.sprite.run.cropXr;
    player.currentCropY = player.sprite.run.cropY;
  } else if (
    keys.left.pressed &&
    sharedData.lastKey === "left" &&
    player.currentSprite !== player.sprite.run.left
  ) {
    player.currentSprite = sharedData.playerPowerUp
      ? player.sprite.run.leftP
      : player.sprite.run.left;

    player.currentCropX = player.sprite.run.cropXl;
    player.currentCropY = player.sprite.run.cropY;
  } else if (
    !keys.left.pressed &&
    sharedData.lastKey === "left" &&
    player.currentSprite !== player.sprite.stand.left
  ) {
    player.currentSprite = sharedData.playerPowerUp
      ? player.sprite.stand.leftP
      : player.sprite.stand.left;
    player.currentCropX = player.sprite.stand.cropXl;
    player.currentCropY = player.sprite.stand.cropY;
  } else if (
    !keys.right.pressed &&
    sharedData.lastKey === "right" &&
    player.currentSprite !== player.sprite.stand.right
  ) {
    player.currentSprite = sharedData.playerPowerUp
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
  if (sharedData.playerPowerUp && !fireBallPushed && keys.space.pressed) {
    if (sharedData.lastKey === "right") {
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
    } else if (sharedData.lastKey === "left") {
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

*The power object's visibility is set to false, sharedData.playerPowerUp flag is set to true, and the sharedData.scoreBoard is increased by 1000.

*Player is then able to throw Fireball by pressing space bar.
*/
function handlePowerObjectCollision() {
  powerObjects.forEach((powerObject) => {
    if (checkCollision(player, powerObject)) {
      if (powerObject.visible) {
        powerObject.visible = false;
        sharedData.playerPowerUp = true;
        sharedData.scoreBoard += 1000;
      }
    }
  });
}

/**

*Handles the collision between the player and obstacle objects.

*Checks for collision between the player and each obstacle object in the obstacleObjects array.

*If the obstacle object is visible, it checks for collision with fire balls.

*If a collision is detected, the corresponding fire ball is removed, sharedData.scoreBoard is increased by 500, and the obstacle object is made invisible.

*It also checks if the player is on top of the obstacle object, in which case it sets the isPlayerOnObstacle flag to true and increases the sharedData.scoreBoard by 500.

*If there is a collision between the player and the obstacle object, it handles different cases:

*If the player is on top of the obstacle, the obstacle object is made invisible.

*If the player is colliding with the obstacle and the player has a power-up, the obstacle object is made invisible, the player loses the power-up, and the sharedData.scoreBoard is decreased by 800.

*If the obstacle object is visible, it calls the CheckHiScore function with the current sharedData.scoreBoard value.
*/
function handleObstacleCollision() {
  obstacleObjects.forEach((obstacleObject) => {
    if (obstacleObject.visible) {
      fireBalls.forEach((fireBall, index) => {
        if (checkCollision(fireBall, obstacleObject)) {
          fireBalls.splice(index, 1);
          sharedData.scoreBoard += 500;
          obstacleObject.visible = false;
          return;
        }
      });
    }

    if (checkObjectOnTop(player, obstacleObject)) {
      obstacleObject.isPlayerOnObstacle = true;

      sharedData.scoreBoard += 500;
    }

    if (checkCollision(player, obstacleObject)) {
      if (obstacleObject.isPlayerOnObstacle) {
        obstacleObject.visible = false;
        return;
      }
      if (obstacleObject.visible && sharedData.playerPowerUp) {
        obstacleObject.visible = false;
        sharedData.playerPowerUp = false;
        sharedData.scoreBoard -= 800;
      }
      obstacleObject.visible && CheckHiScore(sharedData.scoreBoard);
    }
  });
}

/**
 *Checks for collision between the player and the flag.
 *If a collision is detected, it updates the hi-score based on the current score.
 */
function checkFlagCollision() {
  if (checkCollision(player, Flag)) {
    CheckHiScore(sharedData.scoreBoard, "reached");
  }
}

document.addEventListener("keydown", ({ code }) => {
  if (sharedData.keysAccess) {
    switch (code) {
      case "ArrowUp":
        if (!upKeyHeld && player.isPlayerOnGround && !sharedData.isPaused) {
          player.movement.y -= 26;
          upKeyHeld = true;
          player.isPlayerOnGround = false;
        }
        break;
      case "ArrowLeft":
        if (!sharedData.isPaused) {
          keys.left.pressed = true;
          sharedData.lastKey = "left";
        }

        break;
      case "ArrowRight":
        if (!sharedData.isPaused) {
          keys.right.pressed = true;
          sharedData.lastKey = "right";
        }

        break;
      case "Space":
        if (!sharedData.isPaused) {
          keys.space.pressed = true;
        }

        break;
    }
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
