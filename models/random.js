const mongoose = require('mongoose');

const randomSchema = new mongoose.Schema({
  userId: String,
  username: String,
  email: String,
  age: Number,
});

Random = mongoose.model('Random', randomSchema);
module.exports = Random;
