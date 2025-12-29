import express from "express";
import pool from "../creatDatabase/db.js";

const journalStats = express.Router();
// احصاءات عامه للمجله
journalStats.get("/", async (req, res) => {
  try {
    const [
      usersCount,
      researchCount,
      researchByStatus,
      usersByRole,
      researchByField
    ] = await Promise.all([
      
      // إجمالي عدد المستخدمين
      pool.query("SELECT COUNT(*) as total FROM users"),

      // إجمالي عدد الأبحاث المقدمة
      pool.query("SELECT COUNT(*) as total FROM research"),

      // عدد الأبحاث حسب الحالة (مثلاً: under_review, post, reject)
      // يعتمد على عمود status_research في جدول research
      pool.query(`
        SELECT status_research, COUNT(*) as count 
        FROM research 
        GROUP BY status_research
      `),

      // عدد المستخدمين حسب الدور (author, reviewer, editor)
      // يعتمد على عمود role في جدول users
      pool.query(`
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
      `),

      // عدد الأبحاث حسب المجال البحثي (للمخططات الدائرية)
      // يعتمد على عمود research_field في جدول research
      pool.query(`
        SELECT research_field, COUNT(*) as count 
        FROM research 
        GROUP BY research_field 
        ORDER BY count DESC 
        LIMIT 5
      `)
    ]);

    // تنسيق البيانات للإرسال
    const stats = {
      totalUsers: usersCount[0][0].total,
      totalResearches: researchCount[0][0].total,
      researchStatus: researchByStatus[0], // مصفوفة تحتوي الحالة والعدد
      usersRoles: usersByRole[0],          // مصفوفة تحتوي الدور والعدد
      topFields: researchByField[0]        // مصفوفة تحتوي أكثر 5 مجالات بحثية
    };

    res.status(200).json(stats);

  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: "Server error while fetching statistics" });
  }
});

export default journalStats;