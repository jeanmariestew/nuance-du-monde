import fs from 'fs';
import path from 'path';
import pool from './db';

function splitSqlStatements(sql: string): string[] {
  // naive split on semicolon at end of line; ignores inside strings for our simple files
  return sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function executeSqlFile(relativeFilePath: string) {
  const filePath = path.resolve(process.cwd(), relativeFilePath);
  const sql = fs.readFileSync(filePath, 'utf8');
  const statements = splitSqlStatements(sql);
  const conn = await pool.getConnection();
  try {
    for (const stmt of statements) {
      await conn.query(stmt);
    }
  } finally {
    conn.release();
  }
}
