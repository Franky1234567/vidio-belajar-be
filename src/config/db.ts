import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

console.log("DB CONFIG:", {
  MYSQL_URL: process.env.MYSQL_URL ? "SET" : "NOT SET",
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
});

const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
    });

const db = pool.promise();

db.query("SELECT 1")
  .then(() => console.log("DB connection OK"))
  .catch((err) => console.error("DB connection FAILED:", err.message));

export default db;