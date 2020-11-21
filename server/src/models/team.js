const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

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
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },

  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players',
  },

  modifiedAt: {
    type: Date,
    default: Date.now,
  },

  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players',
  }
});

teamSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

teamSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.modifiedAt = Date.now();
  }
  next();
});


module.exports = mongoose.model('Team', teamSchema);
