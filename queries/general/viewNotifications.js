import express from "express";
import pool from "../general/db.js";

const viewNotifications = express.Router();
const updateNotificationIsRead = express.Router();
// برجع الاشعارات المقروءه والغير مقروءه
// هنا يمكن معرفة الاشعارات الجديده والتي تكون قيمها 
// is_read = 0
// GET notifications for a user
viewNotifications.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
});

// عند استدعائه تصبح جميع الاشعارات مقروءه
updateNotificationIsRead.put("/notifications/read/:user_id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Update Notification Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
});

export default viewNotifications;
