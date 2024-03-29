const database = require('../database/database');
const logger = require('../logger');

// Get all reviews from database
const getReviews = (callback) => {
  const sql = `SELECT * FROM Reviews`;
  database.appDatabase.all(sql, [], (error, rows) => {
    if (error) {
      logger.error('Error getting Reviews:', error);
      console.error(error.message);
    }
    logger.info('Reviews data got from Review table');
    callback(rows);
  });
};

// Create new review
const createReview = (bookTitle, bookAuthor, rating, comments, callback) => {
    const sql = `INSERT INTO Reviews (book_title, book_author, rating, comments) VALUES ('${bookTitle}', '${bookAuthor}', '${rating}', '${comments}')`;
    database.appDatabase.run(sql, [], (error, row) => {
      if (error) {
        logger.error('Error creating Review:', error);
        callback(error.message);
      }
      logger.info('New Review created in Review table');
      const successMessage = "The review was entered successfully."
      callback(successMessage);
    });
  };
  

  // Get review
const getReview = (id, callback) => {
    const sql = `SELECT * FROM Reviews WHERE review_id = ${id}`;
    database.appDatabase.get(sql, [], (error, row) => {
      if (error) {
        logger.error('Error getting Review data :', error);
        callback(error.message);
      }
      logger.info('Review data got from Review table');
      callback (row);
    });
  };

  // Delete review  
const deleteReview = (id, callback) => {
    const sql = `DELETE FROM Reviews WHERE review_id = ${id}`;
    database.appDatabase.run(sql, [], (error, row) => {
      if (error) {
        logger.error('Error deleting Review:', error);
        callback(error.message);
      }
      logger.info('Review deleted from Review table');
      const successMessage = "The review was successfully deleted."
      callback(successMessage);
    });
  };
  
  // Update review  
  const updateReview = (bookTitle, bookAuthor, rating, comments, id, callback) => {
    let sql = `UPDATE Reviews SET book_title = '${bookTitle}', book_author = '${bookAuthor}', rating = '${rating}', comments = '${comments}' WHERE (review_id = ${id})`;
    database.appDatabase.run(sql, [], (error, row) => {
      if (error) {
        logger.error('Error updating Review:', error);
        callback(error.message);
      }
      logger.info('Review data updated in Review table');
      const successMessage = "The review was successfully updated."
      callback(successMessage);
    });
  };
  

// Export models
module.exports = {
  getReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview
};