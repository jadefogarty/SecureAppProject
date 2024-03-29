const express = require('express');
const router = express.Router();
const review_controller = require('../controllers/review_controller');
const user_controller = require('../controllers/user_controller');
const reviewValidator = require('../validation/reviewValidator')

//GET Index Page
router.get('/', review_controller.review_index);

//GET/POST Create Page
router.get('/review/create', user_controller.allowIfLoggedin, review_controller.review_create_get);
router.post('/review/create', reviewValidator.validateReview, review_controller.review_create_post);
// GET/POST Delete Page
router.get('/review/delete/:id', user_controller.allowIfLoggedin, user_controller.grantAccess('deleteAny', 'review'), review_controller.review_delete_get);
router.post('/review/delete/:id', review_controller.review_delete_post);
// GET/POST Update Page
router.get('/review/update/:id',  user_controller.allowIfLoggedin, review_controller.review_update_get);
router.post('/review/update/:id', reviewValidator.validateReview, review_controller.review_update_post);

module.exports = router;