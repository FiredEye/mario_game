/**
 * Represents a background object in the game.
 */
export default class BackgroundObject {
  #context;
  #image;
  /**
   * Creates a new BackgroundObject instance.
   * @param {Object} options - The options for configuring the background object.
   * @param {Object} options.position - The position of the background object.
   * @param {number} options.position.x - The x-coordinate of the background object.
   * @param {number} options.position.y - The y-coordinate of the background object.
   * @param {number} options.width - The width of the background object.
   * @param {number} options.height - The height of the background object.
   * @param {Image} options.image - The image of the background object.
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
   * Draws the background object on the canvas.
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
