const { knex } = require("knex");
const dotenv = require("dotenv");
dotenv.config();
// Connection configuration
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

async function createTableIfNotExists() {
  try {
    const tableExists = await db.schema.hasTable("scoreTable");

    if (tableExists) {
      console.log("Table already exists");
    } else {
      await db.schema.createTable("scoreTable", (table) => {
        table.increments("id").primary();
        table.string("name", 255);
        table.integer("score");
        table.string("code", 255);
        table.string("created_at");
        table.string("updated_at");
      });
      console.log("Table created successfully");
    }
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await db.destroy();
  }
}

// Call the function to create the table
createTableIfNotExists();
