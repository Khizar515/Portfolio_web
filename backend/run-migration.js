const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'portfolio_user',
      password: process.env.DB_PASSWORD || 'portfolio_pass',
      database: process.env.DB_NAME || 'portfolio_db',
      multipleStatements: true
    });
    
    const sql = fs.readFileSync(path.join(__dirname, '../database/migration.sql'), 'utf8');
    await connection.query(sql);
    console.log('Migration executed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
