const mongoose = require('mongoose');
const {
    ASSET_TYPE_AVATAR,
    ASSET_TYPE_CHUNK,
    ASSET_TYPE_THUMBNAIL
} = require('../constants/constants');

const assetSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            ASSET_TYPE_AVATAR,
            ASSET_TYPE_CHUNK,
            ASSET_TYPE_THUMBNAIL
        ],
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
});

assetSchema.set('timestamps', true);
module.exports = mongoose.model('Assets', assetSchema);