import express from "express";
import pool from "../creatDatabase/db.js";
import addNotification from "../general/addNotification.js";
import multer from "multer"; // مكتبة التعامل مع الملفات
import path from "path";
import fs from "fs";

const createResearch = express.Router();

// ===========================
// إعداد تخزين الملفات
// ===========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/research_files";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// ===========================
// إنشاء بحث جديد مع رفع الملف
// ===========================
createResearch.post("/", upload.single("file"), async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      title,         // من form.title
      type,          // من form.type
      field,         // من form.field
      description,   // من form.description
      author_id,     // يجب أن ترسله من الـ frontend
      agreedToPolicy // يجب أن ترسله من الـ frontend
    } = req.body;

    // ===== التحقق من الموافقة على السياسات =====
    if (agreedToPolicy !== "true") {
      return res.status(400).json({ error: "You must agree to the publication policy." });
    }

    // ===== التحقق من وجود الملف والحقول الأساسية =====
    if (!title || !type || !req.file) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    await connection.beginTransaction();

    // ===== إدخال البحث في قاعدة البيانات =====
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
      title,
      req.file.path, 
      type,
      description,
      field
    ]);

    const newResearchId = researchResult.insertId;

    // ===== ربط البحث بالمؤلف =====
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

    // ===== إرسال إشعارات للمحررين =====
    const [editors] = await connection.query(
      "SELECT id FROM users WHERE role = 'editor'"
    );

    for (const editor of editors) {
      await addNotification(
        connection,
        editor.id,
        "New Research Pending Review",
        `A new research titled "${title}" has been submitted and is awaiting your review.`
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

// import express from "express";
// import pool from "../creatDatabase/db.js";
// import addNotification from "../general/addNotification.js";

// const createResearch = express.Router();

// /* =========================
//    إنشاء بحث جديد
// ========================= */
// createResearch.post("/", async (req, res) => {
//   const connection = await pool.getConnection();

//   try {
//     const {
//       research_title,
//       address_file,
//       type_research,
//       abstract,
//       research_field,
//       author_id,
//     } = req.body;

//     await connection.beginTransaction();

//     // إدخال البحث
//     const insertResearchQuery = `
//       INSERT INTO research (
//         research_title,
//         status_research,
//         address_file,
//         type_research,
//         abstract,
//         research_field,
//         created_at,
//         updated_at
//       ) VALUES (?, 'under_review', ?, ?, ?, ?, NOW(), NOW())
//     `;

//     const [researchResult] = await connection.query(insertResearchQuery, [
//       research_title,
//       address_file,
//       type_research,
//       abstract,
//       research_field,
//     ]);

//     const newResearchId = researchResult.insertId;

//     // ربط البحث بالمؤلف
//     const insertReviewQuery = `
//       INSERT INTO reviews (
//         author_id,
//         research_id,
//         created_at,
//         updated_at
//       ) VALUES (?, ?, NOW(), NOW())
//     `;

//     await connection.query(insertReviewQuery, [author_id, newResearchId]);

//     await connection.commit();

//     /* =========================
//        إرسال إشعار للمحررين
//     ========================= */
//     const [editors] = await connection.query(
//       "SELECT id FROM users WHERE role = 'editor'"
//     );

//     for (const editor of editors) {
//       await addNotification(
//         connection,
//         editor.id,
//         "New Research Pending Review",
//         `A new research titled "${research_title}" has been submitted and is awaiting your review.`
//       );
//     }

//     res.status(201).json({
//       message: "Research created successfully",
//       research_id: newResearchId,
//     });
//   } catch (error) {
//     await connection.rollback();
//     console.error("Transaction Error:", error);

//     res.status(500).json({
//       error: "Failed to create research",
//     });
//   } finally {
//     connection.release();
//   }
// });

// export default createResearch;
