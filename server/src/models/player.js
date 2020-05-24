const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    max: 255,
    min: 6,
  },

  password: {
    type: String,
    required: true,
    max: 1024,
    min: 8,
  },

  confirmed: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    enum: ['AWP', 'IGL', 'ENTRY', 'SUPPORT', 'RIFLE'],
    required: false,
  },

  avatar: {
    type: String,
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teams',
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Player', playerSchema);
