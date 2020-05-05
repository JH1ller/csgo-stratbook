const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        //unique: true
    },

    role: {
        type: String,
        enum: ['AWP', 'IGL', 'ENTRY', 'SUPPORT', 'RIFLE'],
        required: true
    },

    avatar: {
        type: String
    }
});

module.exports = mongoose.model('Player', playerSchema);