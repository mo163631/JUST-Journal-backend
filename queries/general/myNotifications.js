import express from "express";
import pool from "../creatDatabase/db.js";

const myNotifications = express.Router();

// استرجاع الإشعارات وتغيير حالتها إلى مقروءة في نفس الوقت
// مشاهده الشعارات بحيث تكون حالة الاشعار 1 تمت المشاهده 0 جديده لم تشاهد
// من خلال حالة الاشعارات نعرف كم عدد الاشعارات الجديده
myNotifications.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // أولاً، استرجاع الإشعارات من قاعدة البيانات
    const [rows] = await pool.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );

    // إذا كانت هناك إشعارات غير مقروءة (is_read = 0)، نقوم بتحديثها إلى مقروءة
    if (rows.some((notification) => notification.is_read === 0)) {
      await pool.query(
        "UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0",
        [userId]
      );
    }

    // إعادة الإشعارات مع تحديث الحالة
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

export default myNotifications;
