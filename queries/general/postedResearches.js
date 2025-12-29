import express from "express";
import pool from "../creatDatabase/db.js";

const postedResearches = express.Router();

//برجع الأبحاث المنشورة بحيث تكون حاله البحث status_resarch = “post”
postedResearches.get("/", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const query = `
      SELECT *
      FROM research
      WHERE status_research = 'post'
    `;

    const [researches] = await connection.query(query);

    res.status(200).json({
      message: "Posted researches fetched successfully",
      data: researches,
    });
  } catch (error) {
    console.error("Fetch posted researches error:", error);
    res.status(500).json({
      error: "Failed to fetch posted researches",
    });
  } finally {
    connection.release();
  }
});

export default postedResearches;
