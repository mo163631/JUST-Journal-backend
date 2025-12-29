import express from "express";
import pool from "../creatDatabase/db.js";
import addNotification from "../general/addNotification.js";

const addRating = express.Router();
//هو الreviwer بضيف للبحث قراره و اذا كان في تعليق على البحث يمكن كتابته
// بعد التقيم يتم تحديث حالة البحث الى reviewed

addRating.post("/", async (req, res) => {
  const { suggest, decision, research_id, reviewer_id } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // decision = Accepted or Rejected
    const insertRatingQuery = `
      INSERT INTO ratings (suggest, decision, research_id, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;

    const [ratingResult] = await connection.query(insertRatingQuery, [
      suggest,
      decision,
      research_id,
    ]);

    const newRatingId = ratingResult.insertId;

    const updateReviewQuery = `
      UPDATE reviews
      SET rating_id = ?, updated_at = NOW()
      WHERE research_id = ? AND reviewer_id = ?
    `;

    const [updateResult] = await connection.query(updateReviewQuery, [
      newRatingId,
      research_id,
      reviewer_id,
    ]);

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "Review not found or already rated",
      });
    }

    const updateResearchStatusQuery = `
      UPDATE research
      SET status_research = 'reviewed', updated_at = NOW()
      WHERE id = ?
    `;

    await connection.query(updateResearchStatusQuery, [research_id]);

    const [editors] = await connection.query(
      "SELECT id FROM users WHERE role = 'editor'"
    );

    for (const editor of editors) {
      await addNotification(
        connection,
        editor.id,
        "Research Reviewed",
        `The research with ID ${research_id} has been reviewed by a reviewer.`
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Rating added and research marked as reviewed",
      rating_id: newRatingId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Transaction error:", error);

    res.status(500).json({
      error: "Failed to add rating",
    });
  } finally {
    connection.release();
  }
});

export default addRating;

// import express from "express";
// import pool from "../general/db.js";

// const addRating = express.Router();

// addRating.post("/", async (req, res) => {
//   const { suggest, decision, research_id, reviewer_id } = req.body;
//   const connection = await pool.getConnection();

//   try {
//     await connection.beginTransaction();

//     //decision = Accepted or Rejected
//     const insertRatingQuery = `
//       INSERT INTO ratings (suggest, decision, research_id, created_at, updated_at)
//       VALUES (?, ?, ?, NOW(), NOW())
//     `;
//     const [ratingResult] = await connection.query(insertRatingQuery, [
//       suggest,
//       decision,
//       research_id,
//     ]);

//     const newRatingId = ratingResult.insertId;

//     const updateReviewQuery = `
//       UPDATE reviews
//       SET rating_id = ?, updated_at = NOW()
//       WHERE research_id = ? AND reviewer_id = ?
//     `;
//     const [updateResult] = await connection.query(updateReviewQuery, [
//       newRatingId,
//       research_id,
//       reviewer_id,
//     ]);

//     if (updateResult.affectedRows === 0) {
//       await connection.rollback();
//       return res.status(400).json({
//         message: "Review not found or already rated",
//       });
//     }

//     await connection.commit();

//     res.status(201).json({
//       message: "Rating added successfully",
//       rating_id: newRatingId,
//     });
//   } catch (error) {
//     await connection.rollback();
//     console.error("Transaction error:", error);
//     res.status(500).json({
//       error: "Failed to add rating",
//     });
//   } finally {
//     connection.release();
//   }
// });

// export default addRating;
