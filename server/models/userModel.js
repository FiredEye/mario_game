const { knex } = require("knex");
const dotenv = require("dotenv");
dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

async function insertScore(name, score, code, created_at, updated_at) {
  const result = await db("scoreTable")
    .insert({
      name,
      score,
      code,
      created_at,
      updated_at,
    })
    .returning("*");
  return result[0];
}

async function updateScore(id, score, updated_at) {
  const result = await db("scoreTable")
    .where("id", id)
    .update({ score, updated_at })
    .returning("*");
  return result[0];
}

async function updateLastPlayed(id, updated_at) {
  await db("scoreTable").where("id", id).update({ updated_at });
}

async function getHighestScore() {
  const result = await db("scoreTable").max("score as largest_score");
  const largestScore = result[0].largest_score;
  return largestScore;
}

class Record {
  static async getPaginatedRecords(page, limit) {
    const offset = (page - 1) * limit;

    const paginatedRecords = await db("scoreTable")
      .orderBy("id")
      .offset(offset)
      .limit(limit);

    return paginatedRecords;
  }

  static async getTotalCount() {
    const totalCountQuery = db("scoreTable").count("* as count");
    const totalCountResult = await totalCountQuery;
    const totalCount = parseInt(totalCountResult[0].count);

    return totalCount;
  }
}

module.exports = {
  Record,
  insertScore,
  updateScore,
  updateLastPlayed,
  getHighestScore,
};
