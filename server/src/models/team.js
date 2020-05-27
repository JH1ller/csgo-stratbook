const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },

  password: {
    type: String,
    required: true,
    max: 24,
    min: 6,
  },

  avatar: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Team', teamSchema);
