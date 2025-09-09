// lib/db.ts
import mysql from 'mysql2/promise';

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nuance_du_monde',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 5,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Déclaration du pool dans le scope global pour Next.js hot reload (dev mode)
let pool: mysql.Pool;

// Vérifie s’il existe déjà dans le global (utile en dev avec Next.js)
if (!globalThis.mysqlPool) {
  globalThis.mysqlPool = mysql.createPool(dbConfig);
}
pool = globalThis.mysqlPool;

export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<T> {
  const [results] = await pool.execute<T>(sql, params);
  return results;
}

export default pool;

// Pour TypeScript : ajoute cette déclaration dans un fichier `global.d.ts` ou ici :
declare global {
  // Ne recrée pas la déclaration si elle existe déjà
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}
