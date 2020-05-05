const mongoose = require('mongoose');
const playerSchema = require('./player').schema;

const stepSchema = new mongoose.Schema({

    player: {
        type: playerSchema,
        required: true
    },

    grenades: {
        type: String,
        enum: ['GRENADE', 'FLASHBANG', 'MOLOTOV', 'SMOKE']
    },

    description: {
        type: String,
        required: true
    },

    note: {
        type: String
    }
});

module.exports = mongoose.model('Step', stepSchema);