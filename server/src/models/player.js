const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 3,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
    minlength: 6,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
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
    ref: 'Team',
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
