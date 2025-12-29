import express from "express";
import pool from "../creatDatabase/db.js";

const getReviewers = express.Router();

//لي ارجاع الامراجعين لي اختيار منهم مراجع لي بحث معين
getReviewers.get("/", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const query = `
      SELECT *
      FROM users
      WHERE role = 'reviewer'
    `;

    const [reviewers] = await connection.query(query);

    res.status(200).json({
      message: "Reviewers fetched successfully",
      data: reviewers,
    });
  } catch (error) {
    console.error("Fetch reviewers error:", error);
    res.status(500).json({
      error: "Failed to fetch reviewers",
    });
  } finally {
    connection.release();
  }
});

export default getReviewers;
