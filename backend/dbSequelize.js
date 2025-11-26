// backend/sequelize.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'inkmaster_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'db', // en local hors Docker => 'localhost'
    dialect: 'mysql',
    logging: false, // pas de spam SQL dans les logs
  }
);

export default sequelize;
