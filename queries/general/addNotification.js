import pool from "../creatDatabase/db.js";
//لي ارسال اشعار
function addNotification(connection, userId, title, message) {
  const sql =
    "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)";
  connection.query(sql, [userId, title, message], (err) => {
    if (err) console.log(err);
    else console.log("📌 Notification Added!");
  });
}

export default addNotification;
