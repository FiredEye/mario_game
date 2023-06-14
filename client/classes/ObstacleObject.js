/**
 * Represents an obstacle object in the game.
 */
export default class ObstacleObject {
  #gravity;
  #canvas;
  #image;
  #context;
  /**
   * Creates a new ObstacleObject instance.
   * @param {Object} options - The options for configuring the obstacle object.
   * @param {Object} options.position - The position of the obstacle object.
   * @param {number} options.position.x - The x-coordinate of the obstacle object.
   * @param {number} options.position.y - The y-coordinate of the obstacle object.
   * @param {Image} options.image - The image of the obstacle object.
   * @param {number} options.gravity - The gravity affecting the obstacle object's movement.
   * @param {HTMLCanvasElement} options.canvas - The canvas element on which the obstacle object is rendered.
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
    this.isPlayerOnObstacle = false;
    this.#gravity = gravity;
    this.#canvas = canvas;
    this.#context = context;
  }
  /**
   * Draws the obstacle object on the canvas.
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
   * Updates and redraws the obstacle object on the canvas.
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
      }
    }
  }
}
