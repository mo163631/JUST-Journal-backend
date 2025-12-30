import express from "express";
import pool from "../creatDatabase/db.js";
import addNotification from "../general/addNotification.js";

const createResearch = express.Router();

/* =========================
   إنشاء بحث جديد
========================= */
createResearch.post("/", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      research_title,
      address_file,
      type_research,
      abstract,
      research_field,
      author_id,
    } = req.body;

    await connection.beginTransaction();

    // إدخال البحث
    const insertResearchQuery = `
      INSERT INTO research (
        research_title,
        status_research,
        address_file,
        type_research,
        abstract,
        research_field,
        created_at,
        updated_at
      ) VALUES (?, 'under_review', ?, ?, ?, ?, NOW(), NOW())
    `;

    const [researchResult] = await connection.query(insertResearchQuery, [
      research_title,
      address_file,
      type_research,
      abstract,
      research_field,
    ]);

    const newResearchId = researchResult.insertId;

    // ربط البحث بالمؤلف
    const insertReviewQuery = `
      INSERT INTO reviews (
        author_id,
        research_id,
        created_at,
        updated_at
      ) VALUES (?, ?, NOW(), NOW())
    `;

    await connection.query(insertReviewQuery, [author_id, newResearchId]);

    await connection.commit();

    /* =========================
       إرسال إشعار للمحررين
    ========================= */
    const [editors] = await connection.query(
      "SELECT id FROM users WHERE role = 'editor'"
    );

    for (const editor of editors) {
      await addNotification(
        connection,
        editor.id,
        "New Research Pending Review",
        `A new research titled "${research_title}" has been submitted and is awaiting your review.`
      );
    }

    res.status(201).json({
      message: "Research created successfully",
      research_id: newResearchId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Transaction Error:", error);

    res.status(500).json({
      error: "Failed to create research",
    });
  } finally {
    connection.release();
  }
});

export default createResearch;
