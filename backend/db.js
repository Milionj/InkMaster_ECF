// backend/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function connectWithRetry(retries = 5, delay = 2000) {
  const cfg = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  let lastErr;
  while (retries > 0) {
    try {
      const conn = await mysql.createConnection(cfg);
      await conn.execute('SELECT 1');
      await conn.end();

      const pool = mysql.createPool({
        ...cfg,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      console.log(`✅ MySQL OK (${cfg.host}:${cfg.port} / ${cfg.database})`);
      return pool;
    } catch (err) {
      lastErr = err;
      retries -= 1;
      console.error(` MySQL connection failed. Retries left: ${retries}`);
      console.error(err.message);
      if (retries === 0) throw err;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

const db = await connectWithRetry();
export default db;
