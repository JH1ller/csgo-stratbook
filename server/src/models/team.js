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
    minlength: 6,
    maxlength: 100,
  },

  server: {
    type: {
      ip: String,
      password: String,
    },
    minlength: 6,
    maxlength: 200,
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
