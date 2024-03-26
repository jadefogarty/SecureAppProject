const user_model = require('../models/user_models');
const jwt = require('jsonwebtoken');
const { roles } = require('../roles')
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

function users_get(req, res) {
    user_model.getUsers((queryResult) => {
        //console.log(queryResult);
        res.render('users', { users: queryResult });
    });
};

// Create review page controllers
// GET
function user_signup_get(req, res) {
    res.render('signup');
};

// POST
function user_signup_post(req, res) {
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

// Create review page controllers
// GET
function user_login_get(req, res) {
    res.render('login');
};

// POST
async function user_login_post(req, res, next) {
    //console.log(req.body)
    const username = req.body.Username;
    const password = req.body.Password;
    // const role = req.body.Role;
    const user =  await user_model.getUser(username);
    console.log(user)
    // if (!user) return next(new Error('Username does not exist'));
    // let validPassword;
    // if (password === user.password) {
    //     validPassword = true;
    // }
    // else {
    //     validPassword = false;
    // }
    // if (!validPassword) return next(new Error('Password is not correct'))
    // const accessToken = jwt.sign({ username: username }, 'TOKEN', {
    //     expiresIn: "1d"
    // });
    // await user_model.getAndUpdateUserToken(username, accessToken, (result) => {
    //     console.log(result);
    //     //res.redirect('/');
    // });

    // user_model.getUser(username, (error, user) => {
        
        if (!user) {
            return next(new Error('Username does not exist'));
        }

        let validPassword;
        if (password === user.password) {
            validPassword = true;
            console.log("password is valid")
        } else {
            validPassword = false;
        }

        if (!validPassword) {
            return next(new Error('Password is not correct'));
        }

        const accessToken = jwt.sign({ username: username }, 'TOKEN', {
            expiresIn: "1d"
        });

        // user_model.getAndUpdateUserToken(username, accessToken, (result) => {
        //     console.log(result);
        //     res.redirect('/');
        // });

                // Set the access token as a cookie
                res.cookie('access_token', accessToken, { 
                    httpOnly: true, // Cookie is only accessible via HTTP(S) and not JavaScript
                    maxAge: 86400000, // 1 day in milliseconds
                    // You can add other cookie options as needed
                });
        
                // Redirect the user to the homepage or wherever you want
                res.redirect('/');
    // });
};

function grantAccess(action, resource) {
    return async (req, res, next) => {
        try {
            console.log(req.user)
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
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
            return res.status(401).json({
                error: "You need to be logged in to access this route"
            });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    };
};

// // POST
// async function user_logout_post(req, res, next) {
//     //console.log(req.body)
//     const username = req.body.Username;
//     const password = req.body.Password;
//     // const role = req.body.Role;
//     const user = await user_model.getUser(username);
//     if (!user) return next(new Error('Username does not exist'));
//     // let validPassword;
//     // if (password === user.password) {
//     //     validPassword = true;
//     // }
//     // else {
//     //     validPassword = false;
//     // }
//     // if (!validPassword) return next(new Error('Password is not correct'))
//     const accessToken = jwt.sign({ username: username }, 'INVALID-TOKEN', {
//         expiresIn: new Date(0)
//     });
//     await user_model.getAndUpdateUserToken(username, accessToken, (result) => {
//         console.log(result);
//         //res.redirect('/');
//     });
// };

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
            res.redirect('/'); // Redirect the user after logout
        });
    }



module.exports = {
    users_get,
    user_signup_get,
    user_signup_post,
    user_login_get,
    user_login_post,
    grantAccess,
    allowIfLoggedin,
    user_logout_get
}