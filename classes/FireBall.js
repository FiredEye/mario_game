/**
 * Represents a fireball object in the game.
 */
export default class FireBall {
  #context;
  /**
   * Creates a new FireBall instance.
   * @param {Object} options - The options for configuring the fireball object.
   * @param {Object} options.position - The position of the fireball object.
   * @param {number} options.position.x - The x-coordinate of the fireball object.
   * @param {number} options.position.y - The y-coordinate of the fireball object.
   * @param {Object} options.movement - The movement of the fireball object.
   * @param {number} options.movement.x - The movement along the x-axis of the fireball object.
   * @param {number} options.movement.y - The movement along the y-axis of the fireball object.
   * @param {CanvasRenderingContext2D} options.context - The rendering context of the canvas.
   */
  constructor({ position, movement, context }) {
    this.position = position;
    this.movement = movement;
    this.width = 6;
    this.height = 1;
    this.range = this.position.x;
    this.#context = context;
  }
  /**
   * Draws the fireball on the canvas.
   * @private
   */
  #draw() {
    this.#context.beginPath();
    this.#context.arc(
      this.position.x,
      this.position.y,
      this.width,
      0,
      Math.PI * 2
    );
    this.#context.fillStyle = "red";
    this.#context.fill();
    this.#context.closePath();
  }
  /**
   * Updates the position of the fireball and redraws it on the canvas.
   */
  update() {
    this.#draw();
    this.position.x += this.movement.x;
    this.position.y += this.movement.y;
  }
}
