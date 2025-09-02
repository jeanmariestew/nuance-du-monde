const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nuance_du_monde',
};

async function updateOffers() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');

    // Add duration fields if they don't exist
    try {
      await connection.execute(`
        ALTER TABLE offers 
        ADD COLUMN duration_days INT UNSIGNED NULL AFTER duration,
        ADD COLUMN duration_nights INT UNSIGNED NULL AFTER duration_days
      `);
      console.log('Added duration_days and duration_nights columns');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('Duration columns already exist');
      } else {
        throw error;
      }
    }

    // Update offers with duration data
    const updates = [
      { pattern: '%Egypte%', days: 12, nights: 10 },
      { pattern: '%Egypt%', days: 12, nights: 10 },
      { pattern: '%Maroc%', days: 8, nights: 7 },
      { pattern: '%Morocco%', days: 8, nights: 7 },
      { pattern: '%Kenya%', days: 10, nights: 9 },
      { pattern: '%Afrique%', days: 10, nights: 9 },
      { pattern: '%Colombie%', days: 14, nights: 13 },
      { pattern: '%Colombia%', days: 14, nights: 13 },
      { pattern: '%Thaïlande%', days: 7, nights: 6 },
      { pattern: '%Thailand%', days: 7, nights: 6 },
    ];

    for (const update of updates) {
      const [result] = await connection.execute(
        'UPDATE offers SET duration_days = ?, duration_nights = ? WHERE title LIKE ?',
        [update.days, update.nights, update.pattern]
      );
      console.log(`Updated ${result.affectedRows} offers matching "${update.pattern}"`);
    }

    // Set default values for remaining offers
    const [defaultResult] = await connection.execute(
      'UPDATE offers SET duration_days = 7, duration_nights = 6 WHERE duration_days IS NULL'
    );
    console.log(`Set default duration for ${defaultResult.affectedRows} remaining offers`);

    // Add sample dates
    console.log('Adding sample departure dates...');
    
    // Clear existing dates
    await connection.execute('DELETE FROM offer_dates');
    
    // Get all offer IDs
    const [offers] = await connection.execute('SELECT id FROM offers WHERE is_active = 1');
    
    const sampleDates = [
      '2024-03-15', '2024-04-20', '2024-05-10', '2024-06-15', 
      '2024-07-20', '2024-08-25', '2024-09-20', '2024-10-25', '2024-11-30'
    ];

    for (const offer of offers) {
      // Add 4-6 random dates for each offer
      const numDates = Math.floor(Math.random() * 3) + 4; // 4-6 dates
      const selectedDates = sampleDates.slice(0, numDates);
      
      for (const date of selectedDates) {
        await connection.execute(
          'INSERT INTO offer_dates (offer_id, departure_date) VALUES (?, ?)',
          [offer.id, date]
        );
      }
    }
    
    console.log(`Added departure dates for ${offers.length} offers`);
    console.log('All updates completed successfully!');

  } catch (error) {
    console.error('Error updating offers:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

updateOffers();
