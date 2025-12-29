import express from "express";
import pool from "../creatDatabase/db.js";
import bcrypt from "bcryptjs";

const login = express.Router();

const allowedRoles = ["author", "reviewer", "editor"];

login.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = `
      SELECT id, name, email, password, role
      FROM users
      WHERE email = ?
      LIMIT 1
    `;

    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      userId: user.id,
      userName: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default login;

// import express from "express";
// import pool from "../queries/db.js";
// import bcrypt from "bcryptjs";

// const login = express.Router();

// login.post("/", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("Request body:", req.body);

//     const query = "SELECT * FROM users WHERE email = ?";
//     const [rows] = await pool.query(query, [email]);

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const user = rows[0];

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid password" });
//     }

//     res.status(200).json({
//       message: "Login successful",
//       userId: user.id,
//       userName: user.name,
//     });
//   } catch (err) {
//     console.error("Error details:", err);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// });

// export default login;
