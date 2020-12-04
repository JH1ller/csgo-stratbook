const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const stratSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },

  map: {
    type: String,
    enum: ['DUST_2', 'MIRAGE', 'OVERPASS', 'NUKE', 'VERTIGO', 'INFERNO', 'TRAIN'],
    required: true,
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teams',
    required: true,
  },

  side: {
    type: String,
    enum: ['CT', 'T'],
    required: true,
  },

  type: {
    type: String,
    enum: ['PISTOL', 'FORCE', 'BUYROUND'],
    default: 'BUYROUND',
  },

  active: {
    type: Boolean,
    default: true,
  },

  videoLink: {
    type: String,
  },

  note: {
    type: String,
    maxlength: 100
  },

  content: {
    type: String,
    default: ''
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

  shared: {
    type: Boolean,
    default: false
  }
});

stratSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

stratSchema.pre('save', function (next, res) {
  if (this.isModified()) {
    this.modifiedAt = Date.now();
    if (res && res.player) this.modifiedBy = res.player._id;
  }
  next();
});

module.exports = mongoose.model('Strat', stratSchema);
