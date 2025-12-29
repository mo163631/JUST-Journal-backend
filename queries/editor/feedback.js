import express from "express";
import pool from "../creatDatabase/db.js";

const feedback = express.Router();

//ارجاع التغذيه الراجعه او الملاحظات من المستخدمين
feedback.get("/", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const selectQuery = `
      SELECT *
      FROM feedback
      ORDER BY created_at DESC
    `;

    const [feedbacks] = await connection.query(selectQuery);

    res.status(200).json({
      message: "Feedbacks fetched successfully",
      data: feedbacks,
    });
  } catch (error) {
    console.error("Fetch feedback error:", error);
    res.status(500).json({
      error: "Failed to fetch feedbacks",
    });
  } finally {
    connection.release();
  }
});

export default feedback;
