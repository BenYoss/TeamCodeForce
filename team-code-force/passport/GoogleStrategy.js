const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('../.config.js');
const { User } = require('../db');

passport.serializeUser((user, done) => {
  done(null, user[0].dataValues.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: google.clientID,
    clientSecret: google.clientSecret,
  },
  (accessToken, refreshToken, profile, email, done) => {
    User.findOrCreate({
      where: { googleId: email.id },
      defaults: {
        name: email.displayName,
        googleId: email.id,
        // eslint-disable-next-line no-underscore-dangle
        email: email._json.email,
      },
    }).then((user) => {
      done(null, user);
    }).catch((err) => {
      console.log(err);
    });
  }),
);
