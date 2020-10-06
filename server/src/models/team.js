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
  },

  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players',
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

teamSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('Team', teamSchema);
