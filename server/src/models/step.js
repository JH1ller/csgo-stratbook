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
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players',
    required: true,
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
});

module.exports.stepSchema = mongoose.model('Step', stepSchema);
module.exports.equipmentSchema = mongoose.model('Equipment', equipmentSchema);
