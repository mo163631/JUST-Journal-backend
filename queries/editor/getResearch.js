import express from "express";
import pool from "../creatDatabase/db.js";

const getResearch = express.Router();

//لي ارجاع الابحاث التي لم يعين لها مراجع
getResearch.get("/", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const query = `
      SELECT 
        r.id, 
        r.research_title, 
        r.status_research,
        r.type_research,
        r.abstract,
        r.research_field
      FROM research r
      LEFT JOIN reviews rv ON r.id = rv.research_id
      WHERE rv.reviewer_id IS NULL
    `;

    const [researches] = await connection.query(query);

    res.status(200).json({
      message: "Unassigned researches fetched successfully",
      data: researches,
    });
  } catch (error) {
    console.error("Fetch unassigned researches error:", error);
    res.status(500).json({
      error: "Failed to fetch unassigned researches",
    });
  } finally {
    connection.release();
  }
});

export default getResearch;
