const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../logger');

const db_path = path.join(__dirname, '../database', 'Book-Review-App-Database');
const appDatabase = new sqlite3.Database(db_path, sqlite3.OPEN_READWRITE, error => {
  if (error) {
    logger.error('Error creating database:', error);
    console.error(error.message);
  }
  logger.info('Database created');
  logger.info('Server connected to database');
  console.log('Successful connection to the database');
});

module.exports = { appDatabase };