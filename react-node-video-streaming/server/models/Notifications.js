const mongoose = require('mongoose');
const {
  NOTIFICATION_TYPE_COMMENT,
  NOTIFICATION_TYPE_FOLLOW,
  NOTIFICATION_TYPE_LIKE_VIDEO,
  NOTIFICATION_TYPE_LIKE_COMMENT,
} = require('../constants/constants');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      NOTIFICATION_TYPE_COMMENT,
      NOTIFICATION_TYPE_LIKE_VIDEO,
      NOTIFICATION_TYPE_LIKE_COMMENT,
      NOTIFICATION_TYPE_FOLLOW,
    ],
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Videos',
    required: false,
  },
  readAt: {
    type: mongoose.Schema.Types.Date,
    required: false,
  },
});

notificationSchema.set('timestamps', true);
module.exports = mongoose.model('Notifications', notificationSchema);
