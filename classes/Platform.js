/**
 * Represents Platform object in the game.
 */

export default class Platform {
  #context;#image
  /**
   * Creates a new Platform instance.
   * @param {Object} options - The options for configuring the platform object.
   * @param {object} options.position - The position of the obstacle object.
   * @param {number} options.position.x - The x-coordinate of the obstacle object.
   * @param {number} options.position.y - The y-coordinate of the obstacle object.
   * @param {Image} options.image - The image of the obstacle object.
   * @param {CanvasRenderingContext2D} options.context - The rendering context of the canvas.
   */
  constructor({ position, width, height, image, context }) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.width = width;
    this.height = height;
    this.#image = image;
    this.#context = context;
  }
  /**
   * Draws the platform object on the canvas.
   */
  draw() {
    this.#context.drawImage(
      this.#image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
