const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comments',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
});

likeSchema.set('timestamps', true);
module.exports = mongoose.model('CommentLikes', likeSchema);
