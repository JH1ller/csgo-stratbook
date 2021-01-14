const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const utilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
    enum: ['FLASH', 'GRENADE', 'SMOKE', 'MOLOTOV'],
  },

  map: {
    type: String,
    enum: ['DUST_2', 'MIRAGE', 'OVERPASS', 'NUKE', 'VERTIGO', 'INFERNO', 'TRAIN'],
    required: true,
  },

  mouseButton: {
    type: String,
    required: true,
    enum: ['LEFT', 'RIGHT', 'LEFTRIGHT'],
  },

  crouch: {
    type: Boolean,
    required: true,
    default: true,
  },

  movement: {
    type: String,
    enum: ['STILL', 'WALK', 'RUN'],
    required: true,
    default: 'STILL',
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },

  images: {
    type: [String],
    default: [],
  },

  description: {
    type: String,
    maxlength: 200,
  },

  side: {
    type: String,
    enum: ['CT', 'T'],
    required: true,
  },

  videoLink: {
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

  shared: {
    type: Boolean,
    default: false,
  },
});

utilitySchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('Utility', utilitySchema);
