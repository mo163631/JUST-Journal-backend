import pool from "../general/db.js";

async function createRatingsTable() {
  const connection = await pool.getConnection();

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ratings (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        suggest VARCHAR(255) NULL,
        decision VARCHAR(255) NOT NULL,
        research_id BIGINT(20) UNSIGNED NOT NULL,
        created_at TIMESTAMP NULL,
        updated_at TIMESTAMP NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (research_id) 
            REFERENCES research(id) 
            ON UPDATE CASCADE 
            ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    await connection.query(createTableQuery);
    console.log("Ratings table created or already exists.");
  } catch (error) {
    console.error("Error creating ratings table:", error);
  } finally {
    connection.release();
  }
}

export default createRatingsTable;
