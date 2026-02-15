const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.getConnection()
  .then((connection) => {
    console.log("👍 Database connected and pool ready.");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });

module.exports = db;
