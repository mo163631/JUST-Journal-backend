import express from "express";
import pool from "./db.js";
import bcrypt from "bcryptjs";

const createUser = express.Router();

//وظيفة هذا الكود هي إنشاء حساب مستخدم جديد بحيث يكون الrole author قيمه افتراضية
createUser.post("/", async (req, res) => {
  try {
    const {
      prefix,
      name,
      degree,
      email,
      birth_date,
      country,
      institution,
      password,
    } = req.body;

    // ---------------------------------------------------------
    // تشفير كلمة المرور هنا قبل الحفظ
    // ---------------------------------------------------------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // role is author difulte
    const query = `
      INSERT INTO users (
        prefix,
        name,
        degree,
        email,
        birth_date,
        country,
        institution,
        password,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      prefix,
      name,
      degree,
      email,
      birth_date,
      country,
      institution,
      hashedPassword,
    ];

    const [result] = await pool.query(query, values);

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Email is used or onther thing" });
  }
});

export default createUser;
