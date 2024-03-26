const express = require('express');
const app = express();
const PORT = 4567;
const path = require('path');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const user_model = require('./models/user_models');
const cookieParser = require('cookie-parser'); 

const review_routes = require('./routes/review_routes');
const user_routes = require('./routes/user_routes');

app.use(express.static(path.join(__dirname, 'public')));

//set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// To recognize the incoming request object as strings or arrays
app.use (express.urlencoded ({extended: true}));

// app.use(async (req, res, next) => {
//     console.log(req.headers)
//     if (req.headers["x-access-token"]) {
//      const accessToken = req.headers["x-access-token"];
//      const { username, exp } = await jwt.verify(accessToken, 'TOKEN');
//      // Check if token has expired
//      if (exp < Date.now().valueOf() / 1000) { 
//       return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
//      } 
//      res.locals.loggedInUser = await user_model.getUser(username); next(); 
//     } else { 
//      next(); 
//     } 
//    });

// Use cookie-parser middleware
app.use(cookieParser());

// Middleware to verify JWT token
app.use(async (req, res, next) => {
    console.log(req.cookies);
    if (req.cookies.access_token) { // Assuming token is stored in a cookie named accessToken
        const accessToken = req.cookies.access_token;
        try {
            const { username, exp } = await jwt.verify(accessToken, 'TOKEN');
            // Check if token has expired
            if (exp < Date.now().valueOf() / 1000) {
                return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
            }
            res.locals.loggedInUser = await user_model.getUser(username);
            next();
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    } else {
        next();
    }
});

app.use(review_routes);
app.use(user_routes);

//runs server on port 4567
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

app.get('/', (req, res) => {
    res.send('Book Review Application');
});

