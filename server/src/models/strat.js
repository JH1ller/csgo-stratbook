const mongoose = require('mongoose');
const playerSchema = require('./player').schema;
const stepSchema = require('./step').schema;
const Map = require('./map');

const stratSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    map: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'maps',
        required: true
    },

    side: {
        type: String,
        enum: ['CT', 'T'],
        required: true
    },

    type: {
        type: String,
        enum: ['PISTOL', 'FORCE', 'BUYROUND'],
        default: 'BUYROUND'
    },

    active: {
        type: Boolean,
        default: true
    },

    videoLink: {
        type: String,
    },

    note: {
        type: String,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'players'
        // TODO: make required later
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },

    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'players'
    },

    modifiedAt: {
        type: Date,
        required: true,
        default: Date.now
    },

});

module.exports = mongoose.model('Strat', stratSchema);