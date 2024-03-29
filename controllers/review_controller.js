const review_model = require('../models/review_models');
const { validationResult } = require('express-validator');
const logger = require('../logger');

// Index page controller
function review_index(req, res) {
    review_model.getReviews((queryResult) => {
        //console.log(queryResult);
        logger.info('Users data successfully got. Render Home page');
        res.render('index', { reviews: queryResult });
    });
};

// Create review page controllers
// GET
function review_create_get(req, res) {
    logger.info('Create review page rendered');
    res.render('create', { errors: {} });
};

// POST
function review_create_post(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.info('Create field(s) failed validation');
        return res.render('create', { errors: errors.mapped() });
    }
    logger.info('Create field(s) passed validation');
    //console.log(req.body)
    const bookTitle = req.body.BookTitle;
    const bookAuthor = req.body.BookAuthor;
    const rating = req.body.Rating;
    const comments = req.body.Comments;
    review_model.createReview(bookTitle, bookAuthor, rating, comments, (result) => {
        //console.log(result);
        logger.info('Review successfully created');
        res.redirect('/');
    });
};

// Delete review page controllers
// GET
const review_delete_get = (req, res) => {
    const id = req.params.id;
    review_model.getReview(id, (result) => {
        //console.log(result);
        logger.info('Delete page for selected review rendered');
        res.render('delete', { review: result });
    });
};
// POST
const review_delete_post = (req, res) => {
    const id = req.params.id;
    review_model.deleteReview(id, () => {
        logger.info('Review successfully deleted');
        res.redirect('/');
    });
};

// Update review page controllers
// GET
const review_update_get = (req, res) => {
    const id = req.params.id;
    review_model.getReview(id, (result) => {
        logger.info('Update page for selected review rendered');
        res.render('update', { review: result, errors: {} });
    });
};
// POST
const review_update_post = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.info('Update field(s) failed validation');
        return res.render('update', { review: req.body, errors: errors.mapped() });
    }
    logger.info('Update field(s) passed validation');
    const bookTitle = req.body.BookTitle;
    const bookAuthor = req.body.BookAuthor;
    const rating = req.body.Rating;
    const comments = req.body.Comments;
    const id = req.params.id;
    review_model.updateReview(bookTitle, bookAuthor, rating, comments, id, () => {
        logger.info('Review successfully updated');
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