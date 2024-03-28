const express = require('express');
const app = express();
const PORT = 4567;
const path = require('path');
const sqlite3 = require('sqlite3');
const user_model = require('./models/user_models');

const review_routes = require('./routes/review_routes');
const user_routes = require('./routes/user_routes');

app.use(express.static(path.join(__dirname, 'public')));

//set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// To recognize the incoming request object as strings or arrays
app.use (express.urlencoded ({extended: true}));

app.use(review_routes);
app.use(user_routes);

//runs server on port 4567
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

app.get('/', (req, res) => {
    res.send('Book Review Application');
});

