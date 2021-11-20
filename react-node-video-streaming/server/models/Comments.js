const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Videos",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    commentsAnswered: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments"
        }
    ],
});

commentSchema.set('timestamps', true);
module.exports = mongoose.model('Comments', commentSchema);