const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const keySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    max: 20,
    min: 20,
  },

  note: {
    type: String,
  },

  remainingUses: {
    type: Number,
    required: true,
    max: 6,
    min: 0,
    default: 6,
  },

  usedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Player',
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  usedAt: {
    type: [Date],
    default: [],
  },
});

keySchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('Key', keySchema);
