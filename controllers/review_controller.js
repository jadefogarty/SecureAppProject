const review_model = require('../models/review_models');

// Index page controller
function review_index(req, res) {
    review_model.getReviews((queryResult) => {
        console.log(queryResult);
        res.render('index', { reviews: queryResult });
    });
};

// Create review page controllers
// GET
function review_create_get(req, res) {
    res.render('create');
};

// POST
function review_create_post(req, res) {
    //console.log(req.body)
    const bookTitle = req.body.BookTitle;
    const bookAuthor = req.body.BookAuthor;
    const rating = req.body.Rating;
    const comments = req.body.Comments;
    review_model.createReview(bookTitle, bookAuthor, rating, comments, (result) => {
        console.log(result);
        res.redirect('/');
    });
};

// Delete review page controllers
// GET
const review_delete_get = (req, res) => {
    const id = req.params.id;
    review_model.getReview(id, (result) => {
      console.log(result);
      res.render('delete', { review: result });
    });
  };
  // POST
  const review_delete_post = (req, res) => {
    const id = req.params.id;
    review_model.deleteReview(id, () => {
        res.redirect('/');
    });
  };
  
  // Update review page controllers
  // GET
  const review_update_get = (req, res) => {
    const id = req.params.id;
    review_model.getReview(id, (result) => {
        res.render('update', { review: result });
    });
  };
  // POST
  const review_update_post = (req, res) => {
    const bookTitle = req.body.BookTitle;
    const bookAuthor = req.body.BookAuthor;
    const rating = req.body.Rating;
    const comments = req.body.Comments;
    const id = req.params.id;
    review_model.updateReview(bookTitle, bookAuthor, rating, comments, id, () => {
        res.redirect('/');
    });
  };
  
// Export controllers
module.exports = {
    review_index,
    review_create_get,
    review_create_post,
    review_delete_get,
    review_delete_post,
    review_update_get,
    review_update_post

};