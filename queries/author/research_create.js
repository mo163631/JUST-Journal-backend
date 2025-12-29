// // import express from "express";
// // import pool from "../general/db.js";
// // import upload from "../general/multer.js"; // إعداد multer منفصل

// // const router = express.Router();

// // router.post(
// //   "/",
// //   (req, res) => {
// //     upload.single("file")(req, res, (err) => {
// //       if (err) {
// //         return res.status(400).json({
// //           success: false,
// //           message: err.message,
// //         });
// //       }
// //       if (!req.file) {
// //         return res.status(400).json({
// //           success: false,
// //           message: "الرجاء رفع ملف البحث",
// //         });
// //       }
// //       next();
// //     });
// //   },
// //   async (req, res) => {
// //     const connection = await pool.getConnection();

// //     try {
// //       const {
// //         research_title,
// //         type_research,
// //         abstract,
// //         research_field,
// //         author_id,
// //       } = req.body;

// //       // تحقق من البيانات
// //       if (
// //         !research_title ||
// //         !type_research ||
// //         !abstract ||
// //         !research_field ||
// //         !author_id
// //       ) {
// //         return res.status(400).json({
// //           success: false,
// //           message: "جميع الحقول مطلوبة",
// //         });
// //       }

// //       await connection.beginTransaction();

// //       // إدخال البحث
// //       const insertResearchQuery = `
// //         INSERT INTO research (
// //           research_title,
// //           status_research,
// //           address_file,
// //           type_research,
// //           abstract,
// //           research_field,
// //           created_at,
// //           updated_at
// //         )
// //         VALUES (?, 'under_review', ?, ?, ?, ?, NOW(), NOW())
// //       `;

// //       const [researchResult] = await connection.query(
// //         insertResearchQuery,
// //         [
// //           research_title,
// //           req.file.filename, // اسم الملف فقط
// //           type_research,
// //           abstract,
// //           research_field,
// //         ]
// //       );

// //       const researchId = researchResult.insertId;

// //       // ربط الباحث بالبحث
// //       const insertReviewQuery = `
// //         INSERT INTO reviews (
// //           author_id,
// //           research_id,
// //           created_at,
// //           updated_at
// //         )
// //         VALUES (?, ?, NOW(), NOW())
// //       `;

// //       await connection.query(insertReviewQuery, [
// //         Number(author_id),
// //         researchId,
// //       ]);

// //       await connection.commit();

// //       res.status(201).json({
// //         success: true,
// //         message: "تم إنشاء البحث ورفع الملف بنجاح",
// //         data: {
// //           research_id: researchId,
// //           file: req.file.filename,
// //           status: "under_review",
// //         },
// //       });
// //     } catch (error) {
// //       await connection.rollback();
// //       console.error("Create Research Error:", error);

// //       res.status(500).json({
// //         success: false,
// //         message: "حدث خطأ أثناء إنشاء البحث",
// //       });
// //     } finally {
// //       connection.release();
// //     }
// //   }
// // );

// // export default router;

// import express from "express";
// import pool from "../general/db.js";

// const research_create = express.Router();

// //انشاء بحث
// research_create.post("/", async (req, res) => {
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

// export default research_create;

import express from "express";
import pool from "../creatDatabase/db.js";
import addNotification from "../general/addNotification.js";

const research_create = express.Router();

/* =========================
   إنشاء بحث جديد
========================= */
research_create.post("/", async (req, res) => {
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

export default research_create;
