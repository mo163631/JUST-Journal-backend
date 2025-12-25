import express from "express";
import pool from "../db.js";

const countResearchAuthot = express.Router();
//ارجاع احصائيات المستخدم
countResearchAuthot.get("/:authorId", async (req, res) => {
  const { authorId } = req.params;
  const connection = await pool.getConnection();

  try {
    const query = `
      SELECT COUNT(*) AS total_papers
      FROM reviews
      WHERE author_id = ?
    `;

    const [result] = await connection.query(query, [authorId]);

    res.status(200).json({
      message: "Total papers fetched successfully",
      total_papers: result[0].total_papers,
    });

  } catch (error) {
    console.error("Count papers error:", error);
    res.status(500).json({
      error: "Failed to count papers",
    });
  } finally {
    connection.release();
  }
});

export default countResearchAuthot;
