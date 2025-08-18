import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function run() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_NAME) {
    console.error('Missing DB env vars. Required: DB_HOST, DB_PORT, DB_USER, DB_NAME');
    process.exit(1);
  }

  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
    user: DB_USER,
    password: DB_PASSWORD || '',
    database: DB_NAME,
    multipleStatements: true,
    namedPlaceholders: true,
  });

  const sqlPath = path.resolve(process.cwd(), 'scripts/seed.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log('Executing seed.sql...');
  await conn.query(sql);
  console.log('Seeding complete.');
  await conn.end();
}

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
