import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nuance_du_monde',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Créer un pool de connexions
const pool = mysql.createPool(dbConfig);

export default pool;

