const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Routes
const dataRoute = require('./data/data-router');
const usersRoute = require('./users/users-router');


// Middleware
const auth = require('./middleware/auth');
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Routes
app.use('/data/', dataRoute); // Protected routes
app.use('/users', usersRoute);

// Listen on server
app.listen(PORT, () => { console.log(`Server running on port: ${PORT}`); });