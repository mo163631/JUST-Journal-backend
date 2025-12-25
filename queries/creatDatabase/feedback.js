import pool from "../general/db.js";

async function createFeedbackTable() {
  const connection = await pool.getConnection();

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS feedback (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NULL,
        updated_at TIMESTAMP NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    await connection.query(createTableQuery);
    console.log("Feedback table created or already exists.");
  } catch (error) {
    console.error("Error creating feedback table:", error);
  } finally {
    connection.release();
  }
}

export default createFeedbackTable;
