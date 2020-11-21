const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 20,
    min: 3,
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

  avatar: {
    type: String,
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teams',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  modifiedAt: {
    type: Date,
    default: Date.now,
  },

  isOnline: {
    type: Boolean,
  },

  lastOnline: {
    type: Date,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
});

playerSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

playerSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.modifiedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Player', playerSchema);
