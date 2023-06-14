/**
 * Represents a player in the game.
 */
export default class Player {
  #gravity;
  #canvas;
  #context;
  #frames;
  /**
   * Creates a new Player instance.
   * @param {object} sprite - The sprite object containing player sprites.
   * @param {number} gravity - The gravity affecting the player's movement.
   * @param {HTMLCanvasElement} canvas - The canvas element on which the player is rendered.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */

  constructor(sprite, gravity, canvas, context) {
    this.movement = {
      x: 0,
      y: 0,
    };
    this.position = {
      x: 140,
      y: 160,
    };
    this.width = 50;
    this.height = 90;
    this.#frames = 0;

    this.sprite = sprite;
    this.currentSprite = this.sprite.stand.right;
    this.currentCropX = this.sprite.stand.cropXr;
    this.currentCropY = this.sprite.stand.cropY;
    this.isPlayerOnGround = true;
    this.#gravity = gravity;
    this.#canvas = canvas;
    this.#context = context;
  }
  /**
   * Draws the player on the canvas.
   * @private
   */
  #draw() {
    this.#context.drawImage(
      this.currentSprite[this.#frames],
      this.currentCropX,
      this.currentCropY,
      290,
      470,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  /**
   * Updates and redraws the player on the canvas.
   */
  updateDraw() {
    this.#frames++;
    if (
      this.#frames > 9 &&
      (this.sprite.stand.right ||
        this.sprite.stand.left ||
        this.sprite.stand.rightP ||
        this.sprite.stand.leftP)
    ) {
      this.#frames = 0;
    } else if (
      this.#frames > 7 &&
      (this.sprite.run.right ||
        this.sprite.run.left ||
        this.sprite.run.rightP ||
        this.sprite.run.leftP)
    ) {
      this.#frames = 0;
    }

    this.#draw();
    this.position.x += this.movement.x;
    this.position.y += this.movement.y;
    if (
      this.position.y + this.height + this.movement.y <=
      this.#canvas.height
    ) {
      this.movement.y += this.#gravity;
    } else {
      this.isPlayerOnGround = true;
      this.movement.y = 0;
    }
  }
}
