const express = require('express');
const helmet = require('helmet');
const app = express();
const PORT = 4567;
const path = require('path');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const user_model = require('./models/user_models');
const cookieParser = require('cookie-parser'); 
const logger = require('./logger');

const review_routes = require('./routes/review_routes');
const user_routes = require('./routes/user_routes');

app.use(express.static(path.join(__dirname, 'public')));

//set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// To recognize the incoming request object as strings or arrays
app.use (express.urlencoded ({extended: true}));

// Use cookie-parser middleware
app.use(cookieParser());

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'],
        fontSrc: ["'self'", 'https:'],
        imgSrc: ["'self'"],
        objectSrc: ["'none'"],
      }
  }));
// Middleware to verify JWT token
app.use(async (req, res, next) => {
    //console.log(req.cookies);
    if (req.cookies.access_token) {
        const accessToken = req.cookies.access_token;
        try {
            const { username, exp } = await jwt.verify(accessToken, 'TOKEN');
            // Check if token has expired
            if (exp < Date.now().valueOf() / 1000) {
                logger.error('Error verifying token.', error);
                return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
            }
            logger.info('Valid access token, token verified.');
            res.locals.loggedInUser = await user_model.getUser(username);
            next();
        } catch (error) {
            logger.error('Error verifying token.', error);
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
    logger.info('Server is running.');
    console.log('Server running on port ' + PORT);
});

app.get('/', (req, res) => {
    res.send('Book Review Application');
});

