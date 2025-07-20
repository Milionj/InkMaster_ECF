import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function connectWithRetry(retries = 5, delay = 2000) {
  while (retries) {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
      });
      console.log('Connected to MySQL');
      return connection;
    } catch (err) {
      console.error(` MySQL connection failed. Retries left: ${retries - 1}`);
      console.error(err.message);
      retries--;
      if (!retries) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

const db = await connectWithRetry();

export default db;
