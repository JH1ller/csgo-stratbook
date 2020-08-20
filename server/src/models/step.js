const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  grenade: {
    type: Boolean,
    required: true,
    default: false,
  },
  smoke: {
    type: Boolean,
    required: true,
    default: false,
  },
  flashbang: {
    type: Boolean,
    required: true,
    default: false,
  },
  flashbangTwo: {
    type: Boolean,
    required: true,
    default: false,
  },
  molotov: {
    type: Boolean,
    required: true,
    default: false,
  },
  molotov: {
    type: Boolean,
    required: true,
    default: false,
  },
  defuseKit: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const stepSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players',
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  modifiedAt: {
    type: Date,
    default: Date.now,
  },

  actor: {
    type: String,
    max: 30,
  },

  strat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'strats',
    required: true,
  },

  equipment: equipmentSchema,

  description: {
    type: String,
    required: true,
  },

  note: {
    type: String,
  },

  image: {
    type: String,
  },
});

stepSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.modifiedAt = Date.now();
  }
  next();
});

module.exports.stepSchema = mongoose.model('Step', stepSchema);
module.exports.equipmentSchema = mongoose.model('Equipment', equipmentSchema);
