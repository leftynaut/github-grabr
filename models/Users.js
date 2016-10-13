'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  displayName: String,
  image: String,
  github: Object,
  created_at: { type: Date, default: Date.now }
});

var User = mongoose.model('User', userSchema);
module.exports = User;
