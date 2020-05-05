const mongoose = require('mongoose');
const stratSchema = require('./strat').schema;

const mapSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    active: {
        type: Boolean,
        default: true
    },

    image: {
        type: String
    },

});

module.exports = mongoose.model('Map', mapSchema);