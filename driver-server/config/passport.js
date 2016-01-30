var passport = require('passport');
var constants = require('./constants');
var FacebookStrategy = require('passport-facebook').Strategy;
var userController = require('../../server/controllers/userController.js');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: constants.API_URL + "/api/auth/facebook/callback",
    enableProof: true,
    profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      userController.authenticateUser(profile, function(user){
        console.log(user.id);
        return done(null, user);
      });
    });
  }
));

module.exports = passport;
