const mongoose = require('mongoose');
const {
  VIDEO_STATUS_DRAFT,
  VIDEO_STATUS_PUBLISHED,
  VIDEO_STATUS_DELETED,
  VIDEO_MODE_PUBLIC,
  VIDEO_MODE_PRIVATE,
} = require('../constants/constants');

const videoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
  },
  manifestFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assets',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assets',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  numComments: {
    type: Number,
    required: false,
    default: 0,
  },
  restriction: {
    type: String,
    enum: [VIDEO_MODE_PUBLIC, VIDEO_MODE_PRIVATE],
  },
  status: {
    type: String,
    enum: [VIDEO_STATUS_DRAFT, VIDEO_STATUS_PUBLISHED, VIDEO_STATUS_DELETED],
  },
  remoteId: {
    type: String,
    required: true,
  },
});

videoSchema.set('timestamps', true);
module.exports = mongoose.model('Videos', videoSchema);
