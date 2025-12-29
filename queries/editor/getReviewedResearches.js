import express from "express";
import pool from "../creatDatabase/db.js";

const getReviewedResearches = express.Router();

//لي ارجاع الابحاث التي تم تقيمها لي تحديد القرار النهائي
getReviewedResearches.get("/", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const query = `
      SELECT 
        r.id,
        r.research_title, 
        r.abstract, 
        u.name AS reviewer_name, 
        rt.decision
      FROM research r
      JOIN reviews rv ON r.id = rv.research_id
      JOIN users u ON rv.reviewer_id = u.id
      JOIN ratings rt ON rv.rating_id = rt.id
      WHERE 
        rt.decision IS NOT NULL
        AND r.status_research = 'reviewed'
    `;

    const [researches] = await connection.query(query);

    res.status(200).json({
      message: "Reviewed researches fetched successfully",
      data: researches,
    });
  } catch (error) {
    console.error("Fetch reviewed researches error:", error);
    res.status(500).json({
      error: "Failed to fetch reviewed researches",
    });
  } finally {
    connection.release();
  }
});

export default getReviewedResearches;
