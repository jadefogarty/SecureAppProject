const user_model = require('../models/user_models');

async function user_get(req, res) {
    try {
        const username = req.query.username;
        console.log(username);
        const user = await user_model.getUser(username);
        console.log(user);
        res.render('user', { user: user });
    } catch (error) {
        console.log(error);
    }
};

function users_get(req, res) {
    user_model.getUsers((queryResult) => {
        //console.log(queryResult);
        res.render('users', { users: queryResult });
    });
};

// GET
function user_signup_get(req, res) {
    res.render('signup');
};


async function user_signup_post(req, res) {
    try {
        const username = req.body.Username;
        const password = req.body.Password;
        const role = req.body.Role;
        const accessToken = '';

        
        // Create user and await the result
        const result = await user_model.createUser(username, password, role, accessToken);
        console.log(result);

        // Get user and await the result
        const user = await user_model.getUser(username);
        console.log(user);

        res.render('user', { user: user });
    } catch (error) {
        console.log(error);
        // Handle error
    }
};


function user_login_get(req, res) {
    res.render('login');
};

async function user_login_post(req, res, next) {
    try{
    console.log(req.body)
    const username = req.body.Username;
    const password = req.body.Password;
    const user = await user_model.getUser(username);
    console.log(user)
    if (!user) {
        // return next(new Error('Username does not exist'));
        res.render('error', {user: req.body.Username})
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

    
    res.redirect('/');
} catch (error){
    res.render('error', {user: req.body.Username})
}
};


module.exports = {
    users_get,
    user_get,
    user_signup_get,
    user_signup_post,
    user_login_get,
    user_login_post,
}