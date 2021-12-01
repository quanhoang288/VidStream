const mongoose = require('mongoose');
const {
  ASSET_TYPE_AVATAR,
  ASSET_TYPE_CHUNK,
  ASSET_TYPE_MANIFEST,
  ASSET_TYPE_THUMBNAIL,
} = require('../constants/constants');

const assetSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      ASSET_TYPE_AVATAR,
      ASSET_TYPE_CHUNK,
      ASSET_TYPE_MANIFEST,
      ASSET_TYPE_THUMBNAIL,
    ],
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  remoteId: {
    type: String,
    required: false,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Videos',
    required: false,
  },
});

assetSchema.set('timestamps', true);
module.exports = mongoose.model('Assets', assetSchema);
