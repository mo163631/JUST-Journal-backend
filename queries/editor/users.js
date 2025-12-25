import express from "express";
import pool from "../general/db.js";

const users = express.Router();

users.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Server error: " + err);
  }
});

export default users;
