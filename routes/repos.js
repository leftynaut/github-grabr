'use strict';

const express = require('express');
const router = express.Router();

const Repo = require('../models/Repos');
const User = require('../models/Users');

router.post('/import', (req, res) => {
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

router.get('/', (req, res) => {
  Repo.find()
    .sort({
      'stars': -1
    })
    .limit(25)
    .then(data => {
      res.send(data);
    })
});

module.exports = router
