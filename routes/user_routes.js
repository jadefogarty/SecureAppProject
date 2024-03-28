const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');

router.get('/users', user_controller.users_get);
router.get('/user', user_controller.user_get);
//GET/POST Signup Page
router.get('/user/signup', user_controller.user_signup_get);
router.post('/user/signup', user_controller.user_signup_post);
//GET/POST Login Page
router.get('/user/login', user_controller.user_login_get);
router.post('/user/login', user_controller.user_login_post);

module.exports = router;