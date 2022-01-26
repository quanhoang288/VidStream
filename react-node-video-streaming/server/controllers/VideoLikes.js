const VideoModel = require('../models/Videos');
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

    const videoLikes = video.likes || [];

    if (videoLikes.includes(userId)) {
      return res.status(httpStatus.OK).json({
        message: 'Already liked this video',
      });
    }

    videoLikes.push(userId);

    const updatedVideo = await video.update({
      likes: videoLikes,
      isLiked: true,
    });

    return res.status(httpStatus.CREATED).json({
      video: updatedVideo,
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

    const videoLikes = video.likes || [];

    if (!videoLikes.includes(userId)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Not liked this video yet',
      });
    }

    const updatedVideo = await VideoModel.findOneAndUpdate(
      { _id: videoId },
      {
        isLiked: false,
        $pull: {
          likes: userId,
        },
      },
    );

    return res.status(httpStatus.OK).json({
      video: updatedVideo,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error removing like',
    });
  }
};

module.exports = videoLikeController;
