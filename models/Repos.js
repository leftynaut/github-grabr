'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const repoSchema = new Schema({
  unique: {type: String, unique: true},
  repo: String,
  username: String,
  stars: Number,
  fetchedBy: String,
  created_at: { type: Date, default: Date.now }
});

var Repo = mongoose.model('Repo', repoSchema);
module.exports = Repo;
