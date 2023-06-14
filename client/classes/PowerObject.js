/**
 * Represents a power object in the game.
 */
export default class PowerObject {
  #image;
  #gravity;
  #canvas;
  #context;
  /**
   * Creates a new PowerObject instance.
   * @param {Object} options - The options for configuring the power object.
   * @param {Object} options.position - The position of the power object.
   * @param {number} options.position.x - The x-coordinate of the power object.
   * @param {number} options.position.y - The y-coordinate of the power object.
   * @param {Image} options.image - The image of the power object.
   * @param {number} options.gravity - The gravity affecting the power object's movement.
   * @param {HTMLCanvasElement} options.canvas - The canvas element on which the power object is rendered.
   * @param {CanvasRenderingContext2D} options.context - The rendering context of the canvas.
   */
  constructor({ position, image, gravity, canvas, context }) {
    this.movement = {
      x: 0,
      y: 0,
    };
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.width = image.width;
    this.height = image.height;
    this.#image = image;
    this.visible = true;
    this.#gravity = gravity;
    this.#canvas = canvas;
    this.#context = context;
  }
  /**
   * Draws the power object on the canvas.
   * @private
   */
  #draw() {
    this.#context.drawImage(
      this.#image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  /**
   * Updates and redraws the power object on the canvas.
   */
  updateDraw() {
    if (this.visible) {
      this.#draw();
      this.position.x += this.movement.x;
      this.position.y += this.movement.y;
      if (
        this.position.y + this.height + this.movement.y <=
        this.#canvas.height
      ) {
        this.movement.y += this.#gravity;
      } else {
        this.movement.y = 0;
      }
    }
  }
}
