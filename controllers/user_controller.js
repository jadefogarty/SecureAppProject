const user_model = require('../models/user_models');
const jwt = require('jsonwebtoken');
const { roles } = require('../roles')
const { validationResult } = require('express-validator');
// const bcrypt = require('bcrypt');

// async function hashPassword(password) {
//  return await bcrypt.hash(password, 10);
// }

// async function validatePassword(plainPassword, hashedPassword) {
//  return await bcrypt.compare(plainPassword, hashedPassword);
// }

// const signup = async (req, res, next) => {
//  try {
//   const { email, password, role } = req.body
//   const hashedPassword = await hashPassword(password);
//   const newUser = new User({ email, password: hashedPassword, role: role || "basic" });
//   const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
//    expiresIn: "1d"
//   });
//   newUser.accessToken = accessToken;
//   await newUser.save();
//   res.json({
//    data: newUser,
//    accessToken
//   })
//  } catch (error) {
//   next(error)
//  }
// }
async function user_get(req, res) {
    // try {
    //     const username = req.query.username;
    //     console.log(username);
    //     const user = await user_model.getUser(username);
    //     console.log(user);
    //     res.render('user', { user: user });
    // } catch (error) {
    //     console.log(error);
    // }
    const requestedUsername = req.query.username;
    const loggedInUserRole = req.user.role; // Assuming you have stored the role of the logged-in user in req.user

    // Check if the logged-in user is an admin
    if (loggedInUserRole === 'admin') {
        // If the user is an admin, proceed to fetch and return the requested user's data
        const user = await user_model.getUser(requestedUsername);
        if (!user) {
            return res.status(404).render('error', { message: "User not found" });
        }
        res.render('user', { user: user });
    } else {
        // If not an admin, allow reading own data only
        const loggedInUsername = req.user.username;
        if (requestedUsername !== loggedInUsername) {
            return res.status(403).render('error', { message: "You are not authorized to access this user's data" });
        }

        const user = await user_model.getUser(requestedUsername);
        if (!user) {
            return res.status(404).render('error', { message: "User not found" });
        }

        res.render('user', { user: user });
    }
};

function users_get(req, res) {
    user_model.getUsers((queryResult) => {
        //console.log(queryResult);
        res.render('users', { users: queryResult });
    });
};

// Create review page controllers
// GET
function user_signup_get(req, res) {
    res.render('signup', { errors: {} });
};

// POST
function user_signup_post(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', { errors: errors.mapped() });
    }
    //console.log(req.body)
    const username = req.body.Username;
    const password = req.body.Password;
    const role = req.body.Role;
    const accessToken = jwt.sign({ userId: username }, 'TOKEN', {
        expiresIn: "1d"
    });
    user_model.createUser(username, password, role, accessToken, (result) => {
        console.log(result);
        res.redirect('/');
    });
};


// exports.login = async (req, res, next) => {
//     try {
//      const { email, password } = req.body;
//      const user = await User.findOne({ email });
//      if (!user) return next(new Error('Email does not exist'));
//      const validPassword = await validatePassword(password, user.password);
//      if (!validPassword) return next(new Error('Password is not correct'))
//      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d"
//      });
//      await User.findByIdAndUpdate(user._id, { accessToken })
//      res.status(200).json({
//       data: { email: user.email, role: user.role },
//       accessToken
//      })
//     } catch (error) {
//      next(error);
//     }
//    }

function user_login_get(req, res) {
    res.render('login', { errors: {} });
};

async function user_login_post(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { errors: errors.mapped() });
    }
    // console.log(req.body)
    const username = req.body.Username;
    const password = req.body.Password;
    const user = await user_model.getUser(username);
    console.log(user)
    if (!user) {
        return res.render('error', { message: "Username does not exist" });
    }

    let validPassword;
    if (password === user.password) {
        validPassword = true;
        console.log("password is valid")
    } else {
        validPassword = false;
    }

    if (!validPassword) {
        return res.render('error', { message: "Incorrect Password" });
    }

    const accessToken = jwt.sign({ username: username }, 'TOKEN', {
        expiresIn: "1d"
    });
    // Set the access token as a cookie
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: 86400000,
    });

    res.redirect('/');
};

function grantAccess(action, resource) {
    return async (req, res, next) => {
        try {
            console.log(req.user)
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.render('error', { message: "You don't have enough permission to perform this action" });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

async function allowIfLoggedin(req, res, next) {
    try {
        console.log(res.locals)
        const user = res.locals.loggedInUser;
        if (!user)
            return res.render('error', { message: "You need to be logged in to perform this action" });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    };
};

async function denyAlreadyLoggedIn(req, res, next) {
    try {
        console.log(res.locals)
        const user = res.locals.loggedInUser;
        if (user)
            return res.render('error', { message: "You are already logged in" });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    };
};

async function user_logout_get(req, res, next) {
    const username = req.body.Username;

    // Clear the cookie by setting its expiration date to a past time
    res.clearCookie('access_token');

    // Generate an invalid token with expiration set to the past
    const accessToken = jwt.sign({ username: username }, 'INVALID-TOKEN', {
        expiresIn: 0 // Set expiration time to 0 seconds
    });

    await user_model.getAndUpdateUserToken(username, accessToken, (result) => {
        console.log(result);
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