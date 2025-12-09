const mysql = require("mysql2/promise");
// const dotenv = require("dotenv"); 
// dotenv.config();

const db = mysql.createPool({
<<<<<<< HEAD
    host: "localhost",//process.env.DB_HOST ||
    user: "root",//process.env.DB_USER ||
    password:"",//process.env.DB_PASS ||
    database:"zayakazone",//process.env.DB_NAME ||
    port: 3307
=======
    host: process.env.DB_HOST ||"localhost",
    user: process.env.DB_USER ||"root",
    password:process.env.DB_PASS ||"",
    database:process.env.DB_NAME ||"zaykazone",
>>>>>>> 1eb770e54a53f8d864412642744f8cea87bf68ba
});

db.getConnection()
  .then((connection) => {
      console.log("👍 Database connected and pool ready.");
      connection.release();
  })
  .catch((err) => {
      console.error("❌ Database connection error:", err.message);
  });

module.exports=db;
    
