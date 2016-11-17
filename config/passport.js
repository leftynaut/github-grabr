const passport = require('passport');
const User = require('../models/Users');

module.exports = function (app) {

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
      done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
          done(err, user);
      });
  });

  require('./strategies/github')();

};
