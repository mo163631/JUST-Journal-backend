import express from "express";
import pool from "../creatDatabase/db.js";

const countPublishedResearch = express.Router();
//ارجاع احصائيات المستخدم

countPublishedResearch.get("/:authorId", async (req, res) => {
  const { authorId } = req.params;
  const connection = await pool.getConnection();

  try {
    const query = `
      SELECT COUNT(*) AS published_research_count
      FROM research AS r
      JOIN reviews AS rev ON r.id = rev.research_id
      WHERE 
        rev.author_id = ?
        AND r.status_research = 'post'
    `;

    const [result] = await connection.query(query, [authorId]);

    res.status(200).json({
      message: "Published research count fetched successfully",
      published_research_count: result[0].published_research_count,
    });
  } catch (error) {
    console.error("Count published research error:", error);
    res.status(500).json({
      error: "Failed to count published research",
    });
  } finally {
    connection.release();
  }
});

export default countPublishedResearch;
