import express from "express";
import pool from "../creatDatabase/db.js";
import addNotification from "../general/addNotification.js";

const updateStatusResearch = express.Router();

//اعطاء القرار النهائي للبحث من قبل المحرر
//reject or post = status_resarch
updateStatusResearch.put("/:paperId", async (req, res) => {
  const { paperId } = req.params;
  const { status } = req.body; // status values is post or reject
  const connection = await pool.getConnection();

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const query = `
      UPDATE Papers
      SET status = ?
      WHERE id = ?
    `;

    const [result] = await connection.query(query, [status, paperId]);

    const authors = await connection.query(
      "SELECT author_id , FROM reviews WHERE research_id = ?",
      [paperId]
    );

    await addNotification(
      connection,
      authors.author_id,
      "Paper Status Updated",
      `Your paper with ID ${paperId} has been ${
        status === "post" ? "accepted and posted" : "rejected"
      } by the editor.`
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Paper not found",
      });
    }

    res.status(200).json({
      message: `Paper status updated to '${status}' successfully`,
    });
  } catch (error) {
    console.error("Update paper status error:", error);
    res.status(500).json({
      error: "Failed to update paper status",
    });
  } finally {
    connection.release();
  }
});

export default updateStatusResearch;
