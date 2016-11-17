const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const passport = require('passport');
const session = require('express-session');

const db = require('../config/db');

const routes = require('../routes/index');
const auth = require('../routes/auth');
const repos = require('../routes/repos');

const app = express();

app.set('views', path.join(__dirname, '/../client'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(session({
    secret: 'hush',
    resave: true,
    saveUninitialized: true
}));

require('../config/passport')(app);

app.use('/', routes);
app.use('/repos', repos);
app.use('/auth', auth);

module.exports = app;
