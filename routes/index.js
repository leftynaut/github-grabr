'use strict';

const express = require('express');
const router = express.Router();

function authCheck(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', authCheck, (req, res) => {
  res.render('index', {
    name: req.user.displayName
  });
});
