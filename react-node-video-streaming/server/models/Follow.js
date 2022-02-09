const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
});

followSchema.set('timestamps', true);
module.exports = mongoose.model('Follows', followSchema);
