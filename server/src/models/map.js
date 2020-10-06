const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const mapSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  active: {
    type: Boolean,
    default: true,
  },

  image: {
    type: String,
  },
});

mapSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('Map', mapSchema);
