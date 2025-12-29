import pool from "./db.js";

async function createResearchTable() {
  const connection = await pool.getConnection();

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS research (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        research_title VARCHAR(255) NOT NULL,
        status_research VARCHAR(255) NOT NULL DEFAULT 'new',
        address_file VARCHAR(255) NOT NULL,
        type_research VARCHAR(255) NOT NULL,
        abstract VARCHAR(255) NOT NULL,
        research_field VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NULL,
        updated_at TIMESTAMP NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    await connection.query(createTableQuery);
    console.log("Research table created or already exists.");
  } catch (error) {
    console.error("Error creating research table:", error);
  } finally {
    connection.release();
  }
}

export default createResearchTable;
