import express from "express";
import pool from "../../creatDatabase/db.js";
const information = express.Router();

//ارجاع سجل المستخدم لي عرضها على صفحة البروفايل
information.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const connection = await pool.getConnection();

  try {
    const query = `
      SELECT *
      FROM users
      WHERE id = ?
    `;

    const [users] = await connection.query(query, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      data: users[0],
    });
  } catch (error) {
    console.error("Fetch user profile error:", error);
    res.status(500).json({
      error: "Failed to fetch user profile",
    });
  } finally {
    connection.release();
  }
});

export default information;
