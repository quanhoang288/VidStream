const mongoose = require('mongoose');
const {
    NOTIFICATION_TYPE_COMMENT,
    NOTIFICATION_TYPE_LIKE
} = require('../constants/constants');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            NOTIFICATION_TYPE_COMMENT,
            NOTIFICATION_TYPE_LIKE
        ]
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
});

notificationSchema.set('timestamps', true);
module.exports = mongoose.model('Notifications', notificationSchema);