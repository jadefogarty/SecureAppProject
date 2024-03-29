const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const userValidator = require('../validation/userValidator')

router.get('/users', user_controller.allowIfLoggedin, user_controller.grantAccess('deleteAny', 'user'),  user_controller.users_get);
router.get('/user',  user_controller.allowIfLoggedin, user_controller.grantAccess('readOwn', 'user'), user_controller.user_get);

//GET/POST Signup Page
router.get('/user/signup', user_controller.denyAlreadyLoggedIn, user_controller.user_signup_get);
router.post('/user/signup', userValidator.validateUser, user_controller.user_signup_post);
//GET/POST Login Page
router.get('/user/login', user_controller.denyAlreadyLoggedIn, user_controller.user_login_get);
router.post('/user/login', userValidator.validateUser, user_controller.user_login_post);

router.get('/user/logout', user_controller.allowIfLoggedin, user_controller.user_logout_get);


module.exports = router;