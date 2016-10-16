var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var db = require('../db');
var Repo = require('../models/Repos');
var User = require('../models/Users');
var vars = require(`../config`);
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
        clientID: 'f8981b5dd5e3d2489d24',
        clientSecret: process.env.ghSecret,
        callbackURL: '/login/github/return'
    },
    function(accessToken, refreshToken, profile, cb) {
        let query = {
            'github.id': profile.id
          };
        //profile.id is a unique value for github users
        //profile.username

        User.findOne(query, function(err, user) {
            if (user) {
                console.log('User Found');
                cb(null, user)

            } else {
                console.log('User Not Found - Adding to Database');

                let newUser = {};
                newUser.displayName = profile.displayName;
                newUser.image = profile.photos[0].value;
                newUser.github = {
                    id: profile.id,
                    un: profile.username
                };
                new User(newUser).save();

                cb(null, user)
            }
        });
    }
));


var app = express();
module.exports = app;

app.set('views', path.join(__dirname, '/../client'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(require('express-session')({
    secret: 'hush',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/login/github',
    passport.authenticate('github'));

app.get('/login/github/return',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/repos/import', function(req, res) {
    let data = req.body;
    let dataArray = [];
    data.forEach(datum => {
        dataArray.push({
            unique: datum.name + datum.owner.login,
            repo: datum.name,
            username: datum.owner.login,
            stars: datum.stargazers_count,
            fetchedBy: req.user.github.un
        })
    })
    //Repo.find({ repo: 'john', age: { $gte: 18 }}, function (err, docs) {});
    Repo.insertMany(dataArray, answer => {
        console.log(`Data Inserted:`, answer)
    })

    res.send('Done!');
});


app.get('/repos', function(req, res) {
    Repo.find()
        .sort({
            'stars': -1
        })
        .limit(25)
        .then(data => {
            res.send(data);
        })
});

app.get('/', loggedIn, function(req, res) {
    res.render('index', {
        name: req.user.displayName
    });
});
