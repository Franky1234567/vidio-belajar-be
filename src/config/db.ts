import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool({
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });

const db = pool.promise();

export default db;