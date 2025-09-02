import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// Get database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nuance_du_monde',
  multipleStatements: true,
};

async function runMigrations() {
  // Create database connection
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Connected to database');
    
    // Create migrations table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    
    // Get list of migration files
    const migrationFiles = (await fs.promises.readdir(MIGRATIONS_DIR))
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${migrationFiles.length} migration(s) to run`);
    
    // Run each migration
    for (const file of migrationFiles) {
      // Check if migration has already been run
      const [rows] = await connection.execute(
        'SELECT id FROM migrations WHERE name = ?',
        [file]
      ) as any[];
      
      if (rows.length > 0) {
        console.log(`Skipping already executed migration: ${file}`);
        continue;
      }
      
      // Read and execute migration file
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = await fs.promises.readFile(filePath, 'utf8');
      
      console.log(`Running migration: ${file}`);
      await connection.beginTransaction();
      
      try {
        await connection.query(sql);
        await connection.execute(
          'INSERT INTO migrations (name) VALUES (?)',
          [file]
        );
        await connection.commit();
        console.log(`Successfully executed migration: ${file}`);
      } catch (error) {
        await connection.rollback();
        console.error(`Error executing migration ${file}:`, error);
        throw error;
      }
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

runMigrations().catch(console.error);
