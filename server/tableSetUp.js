const { Pool } = require("pg");

// Connection configuration
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "postgres", // Connect to the default 'postgres' database
  user: "postgres",
  password: "ratna@123",
});

async function createTableIfNotExists() {
  // Connect to the default 'postgres' database
  const client = await pool.connect();
  try {
    // Check if the table already exists
    const checkTableQuery = `
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'scoreTable'
          )
        `;
    const checkTableResult = await client.query(checkTableQuery);

    if (checkTableResult.rows[0].exists) {
      console.log("Table already exists");
    } else {
      // Create the table
      const createTableQuery = `
            CREATE TABLE scoreTable (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255),
              score INTEGER
            )
          `;
      await client.query(createTableQuery);
      console.log("Table created successfully");
    }
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    client.release();
    pool.end();
  }
}

// Call the function to create the table
createTableIfNotExists();
