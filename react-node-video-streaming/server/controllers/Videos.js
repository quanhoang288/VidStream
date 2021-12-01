const fs = require('fs');
const path = require('path');
const VideoModel = require('../models/Videos');
const AssetModel = require('../models/Assets');
const httpStatus = require('../utils/httpStatus');
const {
  ASSET_TYPE_CHUNK,
  ASSET_TYPE_MANIFEST,
  ASSET_TYPE_THUMBNAIL,
  VIDEO_STATUS_DRAFT,
} = require('../constants/constants');
const { encode, generateThumbnail } = require('../services/ffmpeg');
const { uploadFolderToDrive } = require('../utils/cloudUpload');
const { ASSET_DIR } = require('../configs');

const videoController = {};

videoController.upload = async (req, res) => {
  try {
    const videoFile = req.file;

    // generate thumbnail and encode video in DASH format
    const thumbnail = await generateThumbnail(videoFile);
    const { targetDir, targetFn } = await encode(videoFile);

    // move manifest file to asset folder
    const manifestFileName = path.basename(targetFn);
    fs.renameSync(
      path.resolve(targetFn),
      path.resolve(path.join(ASSET_DIR, manifestFileName)),
    );

    // upload generated chunks to google drive
    const uploadedFiles = await uploadFolderToDrive(
      targetDir,
      targetDir.split('/')[1],
    );

    // store in database
    const manifestAsset = new AssetModel({
      type: ASSET_TYPE_MANIFEST,
      fileName: manifestFileName,
    });
    const thumbnailAsset = new AssetModel({
      type: ASSET_TYPE_THUMBNAIL,
      fileName: thumbnail.filename,
    });
    const savedManifest = await manifestAsset.save();
    const savedThumbnail = await thumbnailAsset.save();

    const video = new VideoModel({
      manifestFile: savedManifest._id,
      thumbnail: savedThumbnail._id,
      status: VIDEO_STATUS_DRAFT,
    });
    const savedVideo = await video.save();

    const chunkAssets = uploadedFiles.map(
      (file) =>
        new AssetModel({
          type: ASSET_TYPE_CHUNK,
          fileName: file.name,
          remoteId: file.id,
          video: savedVideo._id,
        }),
    );
    const savePromises = chunkAssets.map((asset) => asset.save());
    await Promise.all(savePromises);

    res.status(httpStatus.CREATED).json({ data: savedVideo });
  } catch (err) {
    console.error(err.message);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error uploading video!' });
  }
};

module.exports = videoController;
