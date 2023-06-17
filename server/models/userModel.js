const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function insertScore(name, score) {
  const client = await pool.connect();
  const insertQuery = `
    INSERT INTO scoreTable (name, score)
    VALUES ($1, $2)
    RETURNING *
  `;
  const insertValues = [name, score];

  const result = await client.query(insertQuery, insertValues);

  client.release();

  return result.rows[0];
}

async function updateScore(id, score) {
  const client = await pool.connect();
  const updateQuery =
    "UPDATE scoreTable SET score = $1 WHERE id = $2 RETURNING *";
  const updateValues = [score, id];

  const result = await client.query(updateQuery, updateValues);

  client.release();

  return result.rows[0];
}

async function getAllScores() {
  const client = await pool.connect();
  const selectQuery = "SELECT * from scoreTable";

  const result = await client.query(selectQuery);
  const data = result.rows;

  client.release();

  return data;
}

async function getHighestScore() {
  const client = await pool.connect();
  const selectQuery = "SELECT MAX(score) AS largest_score FROM scoreTable;";

  const result = await client.query(selectQuery);
  const largestScore = result.rows[0].largest_score;

  client.release();

  return largestScore;
}

module.exports = {
  insertScore,
  updateScore,
  getAllScores,
  getHighestScore,
};
