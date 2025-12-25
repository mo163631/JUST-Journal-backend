import pool from "../general/db.js";

async function createNotificationsTable() {
  const connection = await pool.getConnection();

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notifications (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    await connection.query(createTableQuery);
    console.log("Notifications table created or already exists.");
  } catch (error) {
    console.error("Error creating notifications table:", error);
  } finally {
    connection.release();
  }
}

export default createNotificationsTable;
