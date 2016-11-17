const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const User = require('../../models/Users');

module.exports = function () {
  passport.use(new GitHubStrategy({
          clientID: 'f8981b5dd5e3d2489d24',
          clientSecret: process.env.ghSecret,
          callbackURL: 'https://github-grabr.herokuapp.com/auth/github/return'
      },
      (accessToken, refreshToken, profile, cb) => {
          let query = {
              'github.id': profile.id
            };
          //profile.id is a unique value for github users
          //profile.username

          User.findOne(query, (err, user) => {
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
}
