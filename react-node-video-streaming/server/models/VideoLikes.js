const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Videos',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
});

likeSchema.set('timestamps', true);
module.exports = mongoose.model('VideoLikes', likeSchema);
