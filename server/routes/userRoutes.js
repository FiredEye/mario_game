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
 */
router.put("/userData/:id", UserController.updateScore);

/**
 * @swagger
 * /api/data:
 *  get:
 *    description: Use to request all the players data
 *    responses:
 *        '200':
 *           description: Data extacted successfully
 */
router.get("/data", UserController.getAllScores);

/**
 * @swagger
 * /api/highScore:
 *  get:
 *    description: Use to request the highest score among the players
 *    responses:
 *        '200':
 *           description: Data extacted successfully
 */
router.get("/highScore", UserController.getHighestScore);

module.exports = router;
