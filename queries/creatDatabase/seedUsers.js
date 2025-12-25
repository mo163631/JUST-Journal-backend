import pool from "../general/db.js";
import bcrypt from "bcryptjs";

async function seedDatabase() {
  const connection = await pool.getConnection();

  try {
    // Seed Users
    //إنشاء بيانات في قاعدة البيانات عند بدء التطبيق أو إذا كانت الجداول فارغة
    const [userCount] = await connection.query(
      "SELECT COUNT(*) AS total FROM users"
    );
    if (userCount[0].total === 0) {
      console.log("Seeding users...");
      const users = [
        {
          name: "Mohammad Hasan D'yab Alkhatib",
          prefix: "Dr.",
          degree: "PhD in Computer Information System",
          email: "editor@just_journal.com",
          birth_date: "1985-06-14",
          country: "Jordan",
          institution: "Jordan University of Science and Technology",
          role: "editor",
          password: "123456",
        },
        {
          name: "Hamzeh Imad Saleem Bojoq",
          prefix: "Dr.",
          degree: "PhD in Computer Information System",
          email: "reviewer@just_journal.com",
          birth_date: "1988-06-14",
          country: "Jordan",
          institution: "Jordan University of Science and Technology",
          role: "reviewer",
          password: "123456",
        },
        {
          name: "Ahmad Hasan Alkhatib",
          prefix: "Dr.",
          degree: "Doctorate",
          email: "author@just_journal.com",
          birth_date: "1990-06-14",
          country: "Jordan",
          institution: "Jordan University of Science and Technology",
          role: "author",
          password: "123456",
        },
      ];

      for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await connection.query(
          `INSERT INTO users (prefix, name, degree, email, birth_date, country, institution, password, role, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            user.prefix,
            user.name,
            user.degree,
            user.email,
            user.birth_date,
            user.country,
            user.institution,
            hashedPassword,
            user.role,
          ]
        );
      }
      console.log("Users seeded successfully.");
    }

    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    connection.release();
  }
}

export default seedDatabase;
