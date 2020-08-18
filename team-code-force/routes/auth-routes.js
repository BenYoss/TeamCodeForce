/* eslint-disable arrow-parens */
const authRouter = require('express').Router();
const passport = require('passport');

authRouter.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'user is authenticated',
      user: req.user,
      cookies: req.cookies,
    });
  }
});

authRouter.get('/login/failed', (req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: 'user failed to authenticate',
    })
    .catch((err) => res.status(500).send(err));
});

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:3000/login');
});

// auth route for google
authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// callback route for google to redirect to
authRouter.get(
  '/google/redirect',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/',
    failureRedirect: 'http://localhost:3000/login',
  })
);

// auth check middleware
const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.status(404).json({
      success: false,
      message: 'user failed to authenticate',
    });
  }
  // if user is logged in
  next();
};

module.exports = {
  authRouter,
  authCheck,
};
