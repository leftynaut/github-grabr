const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  displayName: String,
  image: String,
  github: Object,
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
