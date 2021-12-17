const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const VideoModel = require('../models/Videos');
const AssetModel = require('../models/Assets');
const httpStatus = require('../utils/httpStatus');
const {
  ASSET_TYPE_CHUNK,
  ASSET_TYPE_MANIFEST,
  ASSET_TYPE_THUMBNAIL,
  VIDEO_STATUS_PUBLISHED,
} = require('../constants/constants');

const { encode, generateThumbnail } = require('../services/ffmpeg');
const {
  downloadFileFromDrive,
  uploadFolderToDrive,
} = require('../utils/cloudUpload');
const { ASSET_DIR, TMP_UPLOAD_DIR } = require('../configs');

const videoController = {};

videoController.upload = async (req, res) => {
  try {
    const videoFile = req.file;
    const { userId, description, restriction } = req.body;

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
      uploadedBy: userId,
      description,
      restriction,
      manifestFile: savedManifest._id,
      thumbnail: savedThumbnail._id,
      status: VIDEO_STATUS_PUBLISHED,
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

videoController.getManifestFile = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await VideoModel.findById(videoId).populate({
      path: 'manifestFile',
      select: 'id fileName',
      model: 'Assets',
    });
    if (!video) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Video not found' });
    }

    const manifestPath = path.resolve(
      `${ASSET_DIR}/${video.manifestFile.fileName}`,
    );
    res.download(manifestPath);
  } catch (err) {
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error fetching manifest file',
    });
  }
};

videoController.downloadVideoChunk = async (req, res) => {
  try {
    const { videoId, chunkName } = req.params;
    const videoChunk = await AssetModel.findOne({
      video: videoId,
      fileName: chunkName,
    });

    if (!videoChunk) {
      return res.status(httpStatus.NOT_FOUND);
    }

    const remoteChunkId = videoChunk.remoteId;
    const tmpDestPath = `${TMP_UPLOAD_DIR}/${remoteChunkId}-${uuidv4()}.m4s`;

    const downloadedChunk = await downloadFileFromDrive(remoteChunkId);

    fs.writeFileSync(tmpDestPath, downloadedChunk.data, (err) => {
      console.log(err);
    });

    // const fileStat = fs.statSync(tmpDestPath);
    // const fileSize = fileStat.size;
    // const head = {
    //   'Content-Length': fileSize,
    //   'Content-Type': 'video/iso.segment',
    // };
    // res.writeHead(200, head);
    // fs.createReadStream(tmpDestPath).pipe(res);
    // fs.unlinkSync(tmpDestPath);
    res.download(tmpDestPath);
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error downloading video chunk',
    });
  }
};

module.exports = videoController;
