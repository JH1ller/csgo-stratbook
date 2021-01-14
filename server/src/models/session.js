const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },

  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },

  expires: {
    type: Date,
    required: true,
  },

  userAgent: {
    type: String,
  },

  ip: {
    type: String,
  },
});

module.exports = mongoose.model('Session', sessionSchema);
