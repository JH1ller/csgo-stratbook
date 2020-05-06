const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({

    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'players',
        required: true
    },

    strat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'strats',
        required: true
    },

    grenades: {
        type: [String],
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