const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const CommentModel = require('../models/Comments');
const VideoModel = require('../models/Videos');
const AssetModel = require('../models/Assets');
const VideoLikeModel = require('../models/VideoLikes');
const CommentLikeModel = require('../models/CommentLikes');
const FollowModel = require('../models/Follow');
const httpStatus = require('../utils/httpStatus');
const {
  ASSET_TYPE_THUMBNAIL,
  VIDEO_STATUS_PUBLISHED,
  VIDEO_STATUS_DELETED,
} = require('../constants/constants');

const { generateThumbnail } = require('../services/ffmpeg');
const {
  downloadFileFromDrive,
  downloadPartialContentFromDrive,
  uploadFileToDrive,
} = require('../utils/cloudUpload');
const { ASSET_DIR, TMP_UPLOAD_DIR } = require('../configs');

const videoController = {};

videoController.getStream = async (req, res) => {
  const { videoId } = req.params;
  const video = await VideoModel.findById(videoId);

  if (!video) {
    return res.status(httpStatus.NOT_FOUND).json({
      error: 'Video not found',
    });
  }

  const { range } = req.headers;
  if (range) {
    const downloadedChunk = await downloadPartialContentFromDrive(
      video.remoteId,
      range,
    );
    const head = {
      'Content-Range': downloadedChunk.headers['content-range'],
      'Accept-Ranges': 'bytes',
      'Content-Length': downloadedChunk.headers['content-length'],
      'Content-Type': downloadedChunk.headers['content-type'],
    };
    res.writeHead(206, head);
    downloadedChunk.data.pipe(res);
  } else {
    const downloadedVideo = await downloadFileFromDrive(video.remoteId);
    const head = {
      'Content-Length': downloadedVideo.headers['content-length'],
      'Content-Type': downloadedVideo.headers['content-type'],
    };
    res.writeHead(200, head);
    downloadedVideo.data.pipe(res);
  }
};

videoController.show = async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.query;

  try {
    const video = await VideoModel.findById(videoId).populate({
      path: 'uploadedBy',
      select: '_id username',
      populate: {
        path: 'avatar',
        select: '_id fileName',
        model: 'Assets',
      },
      model: 'Users',
    });
    if (!userId) {
      return res.status(httpStatus.OK).json({
        video: {
          ...video.toObject(),
          isLiked: false,
        },
      });
    }

    const userLikes = await VideoLikeModel.find({
      user: userId,
    });

    return res.status(httpStatus.OK).json({
      video: {
        ...video.toObject(),
        isLiked:
          userLikes.findIndex((like) => like.video.equals(video._id)) !== -1,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error getting video info',
    });
  }
};

videoController.edit = async (req, res) => {
  const { userId } = req;
  const { videoId } = req.params;
  const { description, restriction } = req.body;
  const newFile = req.file;
  const video = await VideoModel.findById(videoId).populate('thumbnail');
  if (!video) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Video not found with given id',
    });
  }

  if (video.uploadedBy.toString() !== userId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Cannot modify other person videos',
    });
  }

  const updateQuery = {
    description,
    restriction,
  };

  try {
    if (newFile) {
      const thumbnail = await generateThumbnail(newFile);
      const oldThumbnail = video.thumbnail;
      await oldThumbnail.update({ fileName: thumbnail.filename });

      const uploadedVideo = await uploadFileToDrive(
        newFile.path,
        'videos',
        newFile.mimetype,
      );

      updateQuery.remoteId = uploadedVideo.data.id;
    }

    const updatedVideo = await VideoModel.findByIdAndUpdate(
      videoId,
      updateQuery,
      { new: true },
    );
    return res.status(httpStatus.OK).json({
      video: updatedVideo,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error editing video',
    });
  }
};

videoController.delete = async (req, res) => {
  const { userId } = req;
  const { videoId } = req.params;
  try {
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Video not found with given id',
      });
    }
    if (video.uploadedBy != userId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Cannot delete other person videos',
      });
    }

    await video.update({ status: VIDEO_STATUS_DELETED });
    return res.status(httpStatus.OK).json({
      message: 'Deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error deleting video',
    });
  }
};

videoController.getComments = async (req, res) => {
  const { userId } = req;
  const { videoId } = req.params;
  const { lastObjectId, limit } = req.paginationParams;
  let lastRetrievedItem;
  let filter = { video: videoId };

  try {
    if (lastObjectId) {
      lastRetrievedItem = await CommentModel.findById(lastObjectId);
      if (lastRetrievedItem) {
        filter = {
          ...filter,
          createdAt: {
            $lt: lastRetrievedItem.createdAt,
          },
        };
      }
    }

    const videoComments = await CommentModel.find(filter)
      .populate({
        path: 'user',
        select: '_id username',
        populate: {
          path: 'avatar',
          select: '_id fileName',
          model: 'Assets',
        },
        model: 'Users',
      })
      .sort({ createdAt: -1 })
      .limit(limit);

    const commentIds = videoComments.map((comment) => comment._id);
    const existingLikes = await CommentLikeModel.find({
      user: userId,
      comment: {
        $in: commentIds,
      },
    });

    const formattedVideoComments = videoComments.map((comment) => ({
      ...comment.toObject(),
      isLiked:
        existingLikes.findIndex((like) => like.comment.equals(comment._id)) !==
        -1,
    }));

    return res.status(200).json({
      comments: formattedVideoComments,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error getting comments',
    });
  }
};

videoController.upload = async (req, res) => {
  try {
    const videoFile = req.file;
    const { userId, description, restriction } = req.body;

    // generate thumbnail
    const thumbnail = await generateThumbnail(videoFile);

    const uploadedVideo = await uploadFileToDrive(
      videoFile.path,
      'videos',
      videoFile.mimetype,
    );

    // console.log('uploaded: ', uploadedVideo);

    // generate thumbnail and encode video in DASH format
    // const thumbnail = await generateThumbnail(videoFile);
    // const { targetDir, targetFn } = await encode(videoFile);

    // // move manifest file to asset folder
    // const manifestFileName = path.basename(targetFn);
    // fs.renameSync(
    //   path.resolve(targetFn),
    //   path.resolve(path.join(ASSET_DIR, manifestFileName)),
    // );

    // upload generated chunks to google drive
    // const uploadedFiles = await uploadFolderToDrive(
    //   targetDir,
    //   targetDir.split('/')[1],
    // );

    // store in database
    // const manifestAsset = new AssetModel({
    //   type: ASSET_TYPE_MANIFEST,
    //   fileName: manifestFileName,
    // });
    const thumbnailAsset = new AssetModel({
      type: ASSET_TYPE_THUMBNAIL,
      fileName: thumbnail.filename,
    });
    // // const savedManifest = await manifestAsset.save();

    const savedThumbnail = await thumbnailAsset.save();

    // // const video = new VideoModel({
    // //   uploadedBy: userId,
    // //   description,
    // //   restriction,
    // //   manifestFile: savedManifest._id,
    // //   thumbnail: savedThumbnail._id,
    // //   status: VIDEO_STATUS_PUBLISHED,
    // // });

    const video = new VideoModel({
      uploadedBy: userId,
      description,
      restriction,
      thumbnail: savedThumbnail._id,
      status: VIDEO_STATUS_PUBLISHED,
      remoteId: uploadedVideo.data.id,
    });
    const savedVideo = await video.save();

    // // const chunkAssets = uploadedFiles.map(
    // //   (file) =>
    // //     new AssetModel({
    // //       type: ASSET_TYPE_CHUNK,
    // //       fileName: file.name,
    // //       remoteId: file.id,
    // //       video: savedVideo._id,
    // //     }),
    // // );
    // // const savePromises = chunkAssets.map((asset) => asset.save());
    // // await Promise.all(savePromises);

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

videoController.getSuggestedList = async (req, res) => {
  // todo: get random list of videos
  const { userId } = req.query;
  const query = userId
    ? {
        uploadedBy: {
          $ne: userId,
        },
      }
    : {};
  const suggestedList = await VideoModel.find(query)
    .sort({ createdAt: -1 })
    .limit(10)
    .populate({
      path: 'uploadedBy',
      select: '_id username',
      populate: {
        path: 'avatar',
        select: '_id fileName',
        model: 'Assets',
      },
      model: 'Users',
    })
    .populate('thumbnail', '_id fileName', 'Assets');

  if (!userId) {
    return res.status(httpStatus.OK).json({
      suggestedList,
    });
  }
  const userLikes = await VideoLikeModel.find({
    user: userId,
  });

  const formattedSuggestedList = suggestedList.map((video) => ({
    ...video.toObject(),
    isLiked: userLikes.findIndex((like) => like.video.equals(video._id)) !== -1,
  }));

  return res.status(httpStatus.OK).json({
    suggestedList: formattedSuggestedList,
  });
};

videoController.getFollowingVideos = async (req, res) => {
  const { userId } = req;
  try {
    const followingList = await FollowModel.find({ from: userId });
    const followingVideos = await VideoModel.find({
      uploadedBy: { $in: followingList.map((follow) => follow.user) },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'uploadedBy',
        select: '_id username',
        populate: {
          path: 'avatar',
          select: '_id fileName',
          model: 'Assets',
        },
        model: 'Users',
      })
      .populate('thumbnail', '_id fileName', 'Assets');

    const userLikes = await VideoLikeModel.find({
      user: userId,
    });

    const formattedfollowingVideos = followingVideos.map((video) => ({
      ...video.toObject(),
      isLiked:
        userLikes.findIndex((like) => like.video.equals(video._id)) !== -1,
    }));

    return res.status(httpStatus.OK).json({
      followingVideos: formattedfollowingVideos,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error getting following user videos',
    });
  }
};

module.exports = videoController;
