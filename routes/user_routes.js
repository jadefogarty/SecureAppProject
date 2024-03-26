const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');

router.get('/users', user_controller.allowIfLoggedin, user_controller.grantAccess('deleteAny', 'user'),  user_controller.users_get);
//GET/POST Create Page
router.get('/user/signup', user_controller.user_signup_get);
router.post('/user/signup', user_controller.user_signup_post);
//GET/POST Create Page
router.get('/user/login', user_controller.user_login_get);
router.post('/user/login', user_controller.user_login_post);

router.get('/user/logout', user_controller.user_logout_get);


module.exports = router;