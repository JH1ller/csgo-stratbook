const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },

  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players',
    required: true,
  },

  expires: {
    type: Date,
    required: true,
  },

  userAgent: {
    type: String,
  },
});

module.exports = mongoose.model('Session', sessionSchema);
