import express from "express";
import pool from "../creatDatabase/db.js";
import addNotification from "../general/addNotification.js";

const assignReviewer = express.Router();

//تعين مراجع لي بحث
assignReviewer.put("/", async (req, res) => {
  const { reviewer_id, research_id } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const updateReviewsQuery = `
      UPDATE reviews
      SET reviewer_id = ?, updated_at = NOW()
      WHERE research_id = ? AND reviewer_id IS NULL
    `;
    const [reviewsResult] = await connection.query(updateReviewsQuery, [
      reviewer_id,
      research_id,
    ]);

    if (reviewsResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "Reviewer already assigned or review record does not exist",
      });
    }

    const updateResearchQuery = `
      UPDATE research
      SET status_research = 'in review', updated_at = NOW()
      WHERE id = ? AND status_research = 'under_review'
    `;
    await connection.query(updateResearchQuery, [research_id]);

    await addNotification(
      connection,
      reviewer_id,
      "New Research Assigned",
      `You have been assigned to review the research with ID ${research_id}.`
    );

    await connection.commit();

    res.status(200).json({
      message: "Reviewer assigned and research marked as in review",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Transaction error:", error);
    res.status(500).json({
      error: "Failed to assign reviewer and update research",
    });
  } finally {
    connection.release();
  }
});

export default assignReviewer;
