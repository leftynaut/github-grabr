const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema({
  unique: {type: String, unique: true},
  repo: String,
  username: String,
  stars: Number,
  fetchedBy: String,
  created_at: { type: Date, default: Date.now }
});

const Repo = mongoose.model('Repo', repoSchema);
module.exports = Repo;
