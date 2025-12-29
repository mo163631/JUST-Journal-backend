import express from "express";
import pool from "../creatDatabase/db.js";

const myResearch = express.Router();
//ارجاع الاباحث التي تم نشرها
myResearch.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const connection = await pool.getConnection();

  try {
    const selectQuery = `
      SELECT 
        r.id,
        r.research_title,
        r.status_research,
        r.research_field,
        r.type_research,
        r.abstract,
        r.created_at
      FROM research AS r
      JOIN reviews AS rev ON r.id = rev.research_id
      WHERE rev.author_id = ?
      ORDER BY r.created_at DESC
    `;

    const [researches] = await connection.query(selectQuery, [userId]);

    res.status(200).json({
      message: "User's researches fetched successfully",
      data: researches,
    });
  } catch (error) {
    console.error("Fetch researches error:", error);
    res.status(500).json({
      error: "Failed to fetch user's researches",
    });
  } finally {
    connection.release();
  }
});

export default myResearch;
