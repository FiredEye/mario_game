const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 5000;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "User Data API",
      description: "User Data API Information",
      servers: ["http://localhost:5000"],
    },
    // ['.routes/*.js']
  },
  apis: ["index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Enable CORS middleware
app.use(cors());

// Connection configuration
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "ratna@123",
});

app.use(express.json());

// Routes

/**
 * @swagger
 * /api/userData:
 *  post:
 *     description: Use to insert Player Data into Database
 *     responses:
 *        '201':
 *           description: User Data inserted successfully
 */
app.post("/api/userData", async (req, res) => {
  try {
    const { name, score } = req.body;

    const client = await pool.connect();
    const insertQuery = `
    INSERT INTO scoreTable (name, score)
    VALUES ($1, $2)
    RETURNING *
  `;
    const insertValues = [name, score];

    const result = await client.query(insertQuery, insertValues);

    client.release();

    res
      .status(201)
      .json({ message: "Data inserted successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(400).json({ message: "Failed to insert data" });
  }
});

/**
 * @swagger
 * /api/userData/:id:
 *  put:
 *    description: Use to update Player Data into Database
 *    responses:
 *        '200':
 *           description: User Data updated successfully
 */
app.put("/api/userData/:id", async (req, res) => {
  try {
    const { score } = req.body;
    const id = req.params.id;
    const client = await pool.connect();
    const updateQuery =
      "UPDATE scoreTable SET score = $1 WHERE id = $2 RETURNING *";
    const updateValues = [score, id];

    const result = await client.query(updateQuery, updateValues);

    client.release();

    res
      .status(200)
      .json({ message: "Data updated successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(404).json({ message: "Failed to update data" });
  }
});

/**
 * @swagger
 * /api/data:
 *  get:
 *    description: Use to request all the players data
 *    responses:
 *        '200':
 *           description: Data extacted successfully
 */
app.get("/api/data", async (req, res) => {
  try {
    const client = await pool.connect();
    const insertQuery = "SELECT * from scoreTable";

    const result = await client.query(insertQuery);
    const data = result.rows;

    client.release();

    res.status(200).json({ data: data, message: "Data extacted successfully" });
  } catch (error) {
    console.error("Error extracting data:", error);
    res.status(404).json({ message: "Failed to extract data" });
  }
});

/**
 * @swagger
 * /api/highScore:
 *  get:
 *    description: Use to request the highest score among the players
 *    responses:
 *        '200':
 *           description: Data extacted successfully
 */
app.get("/api/highScore", async (req, res) => {
  try {
    const client = await pool.connect();
    const selectQuery = "SELECT MAX(score) AS largest_score FROM scoreTable;";

    const result = await client.query(selectQuery);
    const largestScore = result.rows[0].largest_score;

    client.release();

    res
      .status(200)
      .json({ largestScore, message: "Data extracted successfully" });
  } catch (error) {
    console.error("Error extracting data:", error);
    res.status(404).json({ message: "Failed to extract data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
