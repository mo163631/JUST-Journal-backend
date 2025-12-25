import pool from "../general/db.js";

async function createReviewsTable() {
  const connection = await pool.getConnection();

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        author_id BIGINT(20) UNSIGNED NULL,
        rating_id BIGINT(20) UNSIGNED NULL,
        research_id BIGINT(20) UNSIGNED NULL,
        reviewer_id BIGINT(20) UNSIGNED NULL,
        created_at TIMESTAMP NULL,
        updated_at TIMESTAMP NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (author_id) 
            REFERENCES users(id) 
            ON UPDATE CASCADE 
            ON DELETE CASCADE,
        FOREIGN KEY (rating_id) 
            REFERENCES ratings(id) 
            ON UPDATE CASCADE 
            ON DELETE CASCADE,
        FOREIGN KEY (research_id) 
            REFERENCES research(id) 
            ON UPDATE CASCADE 
            ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    await connection.query(createTableQuery);
    console.log("Reviews table created or already exists.");
  } catch (error) {
    console.error("Error creating reviews table:", error);
  } finally {
    connection.release();
  }
}

export default createReviewsTable;
