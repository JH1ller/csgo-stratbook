const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 24,
    min: 3,
  },

  website: {
    type: String,
    min: 6,
    max: 100,
  },

  server: {
    type: {
      ip: String,
      password: String,
    },
    min: 6,
    max: 200,
  },

  code: {
    type: String,
    required: true,
    min: 20,
  },

  avatar: {
    type: String,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players',
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Team', teamSchema);
