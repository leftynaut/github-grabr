'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/github',
  passport.authenticate('github'));

router.get('/github/return',
  passport.authenticate('github', {
    failureRedirect: '/auth'
  }),
  (req, res) => {
    res.redirect('/');
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
