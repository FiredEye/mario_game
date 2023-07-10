const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

/**
 * @swagger
 * /api/userData:
 *  post:
 *     description: Use to insert Player Data into Database
 *     responses:
 *        '201':
 *           description: User Data inserted successfully
 *        '400':
 *           description: Failed to insert data
 */
router.post("/userData", UserController.createScore);

/**
 * @swagger
 * /api/userData/:id:
 *  put:
 *    description: Use to update Player Data into Database
 *    responses:
 *        '200':
 *           description: User Data updated successfully
 *        '404':
 *           description: Failed to update data
 */
router.put("/userData/:id", UserController.updateScore);

/**
 * @swagger
 * /api/userData/lastPlayed/:id:
 *  put:
 *    description: Use to update Player's last played time into Database
 *    responses:
 *        '200':
 *           description: User last played time updated successfully
 *        '404':
 *           description: Failed to update data
 */
router.put("/userData/lastPlayed/:id", UserController.updateLastPlayed);

/**
 * @swagger
 * /api/records:
 *  get:
 *    description: Retrieve player data with pagination
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        required: false
 *        description: Page number for pagination
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        required: false
 *        description: Number of records per page
 *    responses:
 *      '200':
 *        description: Data extracted successfully
 *      '404':
 *        description: Failed to extract data
 */
router.get("/records", UserController.paginatedScores);

/**
 * @swagger
 * /api/highScore:
 *  get:
 *    description: Use to request the highest score among the players
 *    responses:
 *        '200':
 *           description: Data extacted successfully
 *        '404':
 *           description: Failed to extract data
 */
router.get("/highScore", UserController.getHighestScore);

module.exports = router;
