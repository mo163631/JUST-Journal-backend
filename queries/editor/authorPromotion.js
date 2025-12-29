import express from "express";
import pool from "../creatDatabase/db.js";
import addNotification from "../general/addNotification.js";

const authorPromotion = express.Router();

/**
 * ترقية
 * تحديث دور المستخدم من author إلى reviewer
 * PUT /api/users/:id/role
 */
authorPromotion.put("/:id", async (req, res) => {
  const userId = Number(req.params.id);

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  try {
    const query = `
      UPDATE users
      SET role = 'reviewer'
      WHERE role = 'author' AND id = ?
    `;

    const [result] = await pool.query(query, [userId]);

    // If no rows were updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or role is not author",
      });
    }
    await addNotification(
      connection,
      userId,
      "Role Upgraded",
      "Congratulations! Your role has been upgraded to reviewer."
    );

    res.json({
      success: true,
      message: "User role successfully updated to reviewer",
    });
  } catch (error) {
    console.error("Update Role Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
});

export default authorPromotion;
