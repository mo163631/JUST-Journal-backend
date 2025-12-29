import pool from "./db.js";

async function createAfterUserUpdateTrigger() {
  const connection = await pool.getConnection();

  try {
    // First, drop any trigger with the same name if it exists to avoid errors
    await connection.query(`DROP TRIGGER IF EXISTS after_user_update;`);

    // Create the trigger
    const createTriggerQuery = `
      CREATE TRIGGER after_user_update
      AFTER UPDATE ON users
      FOR EACH ROW
      BEGIN
          IF NEW.updated_at <> OLD.updated_at THEN
              INSERT INTO notifications(user_id, title, message)
              VALUES (
                  NEW.id,
                  'User Data Updated',
                  CONCAT('User data has been updated: ', NEW.name)
              );
          END IF;
      END;
    `;

    await connection.query(createTriggerQuery);
    console.log("Trigger 'after_user_update' created successfully.");
  } catch (error) {
    console.error("Error creating trigger:", error);
  } finally {
    connection.release();
  }
}

export default createAfterUserUpdateTrigger;
