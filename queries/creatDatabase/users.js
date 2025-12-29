import pool from "./db.js";

async function createUsersTable() {
  const connection = await pool.getConnection();

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        prefix VARCHAR(255) DEFAULT NULL,
        name VARCHAR(255) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        birth_date DATE NOT NULL,
        country VARCHAR(255) NOT NULL,
        institution VARCHAR(255) NOT NULL,
        email_verified_at TIMESTAMP NULL DEFAULT NULL,
        password VARCHAR(255) NOT NULL,
        two_factor_secret TEXT,
        two_factor_recovery_codes TEXT,
        remember_token VARCHAR(100) DEFAULT NULL,
        current_team_id BIGINT UNSIGNED DEFAULT NULL,
        profile_photo_path VARCHAR(2048) DEFAULT NULL,
        created_at TIMESTAMP NULL DEFAULT NULL,
        updated_at TIMESTAMP NULL DEFAULT NULL,
        role ENUM('author','reviewer','editor') NOT NULL DEFAULT 'author'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    await connection.query(createTableQuery);
    console.log("Users table created or already exists.");
  } catch (error) {
    console.error("Error creating users table:", error);
  } finally {
    connection.release();
  }
}

export default createUsersTable;
