'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.route('/github')
  .get(passport.authenticate('github'));

router.route('/github/return')
  .get(passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/auth'
  }));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router
