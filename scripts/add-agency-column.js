const mysql = require('mysql2/promise');
require('dotenv').config();

async function addAgencyColumn() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nuance_du_monde',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('Adding agency column to partners table...');
    
    // Check if column already exists
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'partners' AND COLUMN_NAME = 'agency'
    `, [process.env.DB_NAME || 'nuance_du_monde']);

    if (columns.length > 0) {
      console.log('Agency column already exists');
      return;
    }

    // Add the agency column
    await pool.execute('ALTER TABLE partners ADD COLUMN agency VARCHAR(191) NOT NULL DEFAULT \'\' AFTER name');
    console.log('Agency column added successfully');

    // Update existing partners with default agency names
    await pool.execute('UPDATE partners SET agency = \'Agence partenaire\' WHERE agency = \'\'');
    console.log('Updated existing partners with default agency names');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

addAgencyColumn();
