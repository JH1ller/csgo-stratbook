const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 24,
    minlength: 3,
  },

  website: {
    type: String,
    maxlength: 300,
  },

  server: {
    type: {
      ip: String,
      password: String,
    },
  },

  code: {
    type: String,
    required: true,
  },

  avatar: {
    type: String,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },

  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },

  modifiedAt: {
    type: Date,
    default: Date.now,
  },

  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
});

teamSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

teamSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.modifiedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);
