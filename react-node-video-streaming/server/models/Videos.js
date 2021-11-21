const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    description: {
        type: String,
        required: false,
    },
    duration: {
        type: Number,
        required: true,
    },
    baseUrl: {
        type: String,
        required: true,
    },
    manifestUrl: {
            type: String,
            required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    thumbnail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assets'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    numComments: {
        type: Number,
        required: false,
        default: 0
    }
});

videoSchema.set('timestamps', true);
module.exports = mongoose.model('Videos', videoSchema);