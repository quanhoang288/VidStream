const VideoModel = require('../models/Videos');
const LikeModel = require('../models/VideoLikes');
const httpStatus = require('../utils/httpStatus');

const videoLikeController = {};

videoLikeController.create = async (req, res) => {
  const { userId } = req;
  const { videoId } = req.body;
  try {
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Video not found with given id',
      });
    }

    const existingLike = await LikeModel.findOne({
      user: userId,
      video: videoId,
    });

    if (existingLike) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Already liked this video',
      });
    }

    const newLike = new LikeModel({
      user: userId,
      video: videoId,
    });
    const createdLike = await newLike.save();
    await video.update({ numLikes: video.numLikes + 1 });

    return res.status(httpStatus.CREATED).json({
      like: createdLike,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error creating new like',
    });
  }
};

videoLikeController.remove = async (req, res) => {
  const { userId } = req;
  const { videoId } = req.body;
  try {
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Video not found with given id',
      });
    }

    const existingLike = await LikeModel.findOne({
      user: userId,
      liked: videoId,
    });

    if (!existingLike) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Not liked this video yet',
      });
    }

    const deletedLike = await LikeModel.findByIdAndDelete(existingLike._id);
    await video.update({ numLikes: video.numLikes - 1 });

    return res.status(httpStatus.OK).json({
      deletedLike,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error removing like',
    });
  }
};

module.exports = videoLikeController;
