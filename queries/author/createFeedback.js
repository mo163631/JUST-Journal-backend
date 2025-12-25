import express from "express";
import pool from "../general/db.js";
import addNotification from "../general/addNotification.js";

const createFeedback = express.Router();

//انشاء تغذية راجعه
createFeedback.post("/", async (req, res) => {
  const { user_id, message } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const getUserQuery = `
      SELECT name, email
      FROM users
      WHERE id = ?
      LIMIT 1
    `;

    const [users] = await connection.query(getUserQuery, [user_id]);

    if (users.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { name, email } = users[0];

    const insertFeedbackQuery = `
      INSERT INTO feedback (
        name,
        email,
        message,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, NOW(), NOW())
    `;

    await connection.query(insertFeedbackQuery, [name, email, message]);

    const [editors] = await connection.query(
      "SELECT id FROM users WHERE role = 'editor'"
    );

    for (const editor of editors) {
      await addNotification(
        connection,
        editor.id,
        "New Feedback Received",
        `User ${name} submitted new feedback.`
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Feedback sent successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Feedback error:", error);

    res.status(500).json({
      error: "Failed to send feedback",
    });
  } finally {
    connection.release();
  }
});

export default createFeedback;
