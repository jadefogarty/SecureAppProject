const express = require('express');
const router = express.Router();
const review_controller = require('../controllers/review_controller');

//GET Index Page
router.get('/', review_controller.review_index);

//GET/POST Create Page
router.get('/review/create', review_controller.review_create_get);
router.post('/review/create', review_controller.review_create_post);
// GET/POST Delete Page
router.get('/review/delete/:id', review_controller.review_delete_get);
router.post('/review/delete/:id', review_controller.review_delete_post);
// GET/POST Update Page
router.get('/review/update/:id', review_controller.review_update_get);
router.post('/review/update/:id', review_controller.review_update_post);

module.exports = router;