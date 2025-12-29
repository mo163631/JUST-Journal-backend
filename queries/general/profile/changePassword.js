import express from "express";
import pool from "../creatDatabase/db.js";
import bcrypt from "bcryptjs";

const changePassword = express.Router();

changePassword.put("/", async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // التحقق من المدخلات الأساسية
    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const selectQuery = `
      SELECT password 
      FROM users 
      WHERE id = ? 
    `;

    const rows = await pool.query(selectQuery, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentHashedPassword = rows[0].password;

    // مقارنة كلمة المرور القديمة المدخلة مع المشفرة في قاعدة البيانات
    const isMatch = await bcrypt.compare(oldPassword, currentHashedPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    // تشفير كلمة المرور الجديدة
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // تحديث كلمة المرور في الجدول
    const updateQuery = `
      UPDATE users 
      SET password = ? 
      WHERE id = ?
    `;

    await pool.query(updateQuery, [newHashedPassword, userId]);

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default changePassword;
