/**
 * Checks if an object falls on top of a platform.
 * @param {Object} object - The object to check.
 * @param {Object} platform - The platform to check against.
 * @returns {boolean} - True if the object falls on top of the platform, false otherwise.
 */
export function checkObjectOnTop(object, platform) {
  const objectFallsOnPlatform =
    object.position.y + object.height <= platform.position.y &&
    object.position.y + object.height + object.movement.y >=
      platform.position.y &&
    object.position.x + object.width >= platform.position.x &&
    object.position.x < platform.position.x + platform.width;

  return objectFallsOnPlatform;
}

/**
 * Checks if an object collides with a platform.
 * @param {Object} object - The object to check.
 * @param {Object} platform - The platform to check against.
 * @returns {boolean} - True if the object collides with the platform, false otherwise.
 */
export function checkCollision(object, platform) {
  const objectCollied =
    object.position.x + object.width > platform.position.x &&
    object.position.x < platform.position.x + platform.width &&
    object.position.y + object.height > platform.position.y &&
    object.position.y < platform.position.y + platform.height;
  return objectCollied;
}

/**
 * Checks if an object is within the bounds of a canvas.
 * @param {Object} object - The object to check.
 * @param {Object} canvas - The canvas to check against.
 * @returns {boolean} - True if the object is within the canvas bounds, false otherwise.
 */
export function isWithinBounds(object, canvas) {
  return (
    object.position.x + object.width >= 0 && object.position.x <= canvas.width
  );
}
/**
 * Creates an image element with the provided source.
 * @param {string} imgSrc - The source URL of the image.
 * @returns {HTMLImageElement} - The created image element.
 */
export function CreateImage(imgSrc) {
  const image = new Image();
  image.src = imgSrc;
  return image;
}

/**
 * Creates a new Date time.
 * @returns {Date} - The created date time.
 */
export function CreateNewDate() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString({
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return formattedDate;
}
