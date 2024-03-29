const user_model = require('../models/user_models');
const jwt = require('jsonwebtoken');
const { roles } = require('../roles')
const { validationResult } = require('express-validator');
const logger = require('../logger');

async function user_get(req, res) {
    const requestedUsername = req.query.username;
    const loggedInUserRole = req.user.role;

    //check if logged in user is an admin
    if (loggedInUserRole === 'admin') {
        const user = await user_model.getUser(requestedUsername);
        if (!user) {
            logger.error('Error finding username:', error);
            return res.status(404).render('error', { message: "User not found" });
        }
        logger.info('Logged in user has the admin role');
        res.render('user', { user: user });
    } else {
        logger.info('Logged in user has the user role');
        const loggedInUsername = req.user.username;
        if (requestedUsername !== loggedInUsername) {
            logger.error('Error with authorization permissions');
            return res.status(403).render('error', { message: "You are not authorized to access this user's data" });
        }

        const user = await user_model.getUser(requestedUsername);
        if (!user) {
            logger.error('Error finding username');
            return res.status(404).render('error', { message: "User not found" });
        }

        logger.info('User data successfully gotten');
        res.render('user', { user: user });
    }
};

function users_get(req, res) {
    user_model.getUsers((queryResult) => {
        //console.log(queryResult);
        logger.info('Users data successfully gotten');
        res.render('users', { users: queryResult });
    });
};

// Create signup page controllers
// GET
function user_signup_get(req, res) {
    logger.info('Signup page rendered');
    res.render('signup', { errors: {} });
};

// POST
function user_signup_post(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info('Signup field(s) failed validation');
      return res.render('signup', { errors: errors.mapped() });
    }
    logger.info('Signup field(s) passed validation');
    //console.log(req.body)
    const username = req.body.Username;
    const password = req.body.Password;
    const role = req.body.Role;
    const accessToken = jwt.sign({ userId: username }, 'TOKEN', {
        expiresIn: "1d"
    });
    logger.info('Access token assigned to user');
    user_model.createUser(username, password, role, accessToken, (result) => {
        //console.log(result);
        logger.info('User Signup successful');
        res.redirect('/');
    });
};


function user_login_get(req, res) {
    logger.info('Login page rendered');
    res.render('login', { errors: {} });
};

async function user_login_post(req, res) {
    if (!errors.isEmpty()) {
        logger.info('Login field(s) failed validation');
        return res.render('login', { errors: errors.mapped() });
      }
      logger.info('Login field(s) passed validation');
    // console.log(req.body)
    const username = req.body.Username;
    const password = req.body.Password;
    const user = await user_model.getUser(username);
    //console.log(user)
    if (!user) {
        logger.error('Error finding username:', error);
        return res.render('error', { message: "Username does not exist" });
    }

    let validPassword;
    if (password === user.password) {
        validPassword = true;
        logger.info('Password is valid');
        //console.log("password is valid")
    } else {
        validPassword = false;
        logger.info('Password is invalid');
    }

    if (!validPassword) {
        logger.error('Error incorrect password', error);
        return res.render('error', { message: "Incorrect Password" });
    }

    const accessToken = jwt.sign({ username: username }, 'TOKEN', {
        expiresIn: "1d"
    });
    logger.info('Access token assigned to user');
    // Set the access token as a cookie
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: 86400000,
    });
    logger.info('Access token saved to cookie');

    logger.info('User logged in successfully');
    res.redirect('/');
};

function grantAccess(action, resource) {
    return async (req, res, next) => {
        try {
            //console.log(req.user)
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                logger.error('Error user does not have enough permission');
                return res.render('error', { message: "You don't have enough permission to perform this action" });
            }
            logger.info('User has correct permissions');
            next()
        } catch (error) {
            next(error)
        }
    }
}

async function allowIfLoggedin(req, res, next) {
    try {
        //console.log(res.locals)
        const user = res.locals.loggedInUser;
        if (!user){
            logger.error('Error user is not logged in');
            return res.render('error', { message: "You need to be logged in to perform this action" });
        }
        req.user = user;
        logger.info('User is not logged in');
        next();
    } catch (error) {
        next(error);
    };
};

async function denyAlreadyLoggedIn(req, res, next) {
    try {
        console.log(res.locals)
        const user = res.locals.loggedInUser;
        if (user){
            logger.error('Error user is alreadu logged in');
            return res.render('error', { message: "You are already logged in" });
        }
        req.user = user;
        logger.info('User is already logged in');
        next();
    } catch (error) {
        next(error);
    };
};

async function user_logout_get(req, res, next) {
    const username = req.body.Username;

    logger.info('Clearing access token stored in cookie');
    res.clearCookie('access_token');

    const accessToken = jwt.sign({ username: username }, 'INVALID-TOKEN', {
        expiresIn: 0
    });
    logger.info('Assigning invalid token');

    await user_model.getAndUpdateUserToken(username, accessToken, (result) => {
        //console.log(result);
        logger.info('User has no valid token, log out successful');
        res.redirect('/');
    });
}


module.exports = {
    user_get,
    users_get,
    user_signup_get,
    user_signup_post,
    user_login_get,
    user_login_post,
    grantAccess,
    allowIfLoggedin,
    denyAlreadyLoggedIn,
    user_logout_get
}