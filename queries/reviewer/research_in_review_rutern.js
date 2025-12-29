import express from "express";
import pool from "../creatDatabase/db.js";

const research_in_review = express.Router();

//برجع الأبحاث التي حددت للباحث ولتي لم يتم تقيمها
research_in_review.get("/:reviewerId", async (req, res) => {
  const { reviewerId } = req.params;
  const connection = await pool.getConnection();

  try {
    const selectQuery = `
      SELECT 
        r.id AS research_id,
        r.research_title,
        r.abstract,
        r.address_file,
        r.type_research,
        r.status_research,
        rev.id AS review_session_id
      FROM research r
      JOIN reviews rev ON r.id = rev.research_id
      WHERE rev.reviewer_id = ?
        AND rev.rating_id IS NULL
    `;

    const [researches] = await connection.query(selectQuery, [reviewerId]);

    res.status(200).json({
      message: "Researches fetched",
      data: researches,
    });
  } catch (error) {
    console.error("Fetch researches error:", error);
    res.status(500).json({
      error: "Failed to fetch researches",
    });
  } finally {
    connection.release();
  }
});

export default research_in_review;
