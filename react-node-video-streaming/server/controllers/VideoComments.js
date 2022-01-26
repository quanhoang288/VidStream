const VideoModel = require('../models/Videos');
const CommentModel = require('../models/Comments');
const httpStatus = require('../utils/httpStatus');

const videoCommentController = {};

videoCommentController.create = async (req, res) => {
  const { userId } = req;
  const { videoId, content } = req.body;
  try {
    const comment = new CommentModel({
      video: videoId,
      user: userId,
      content,
    });
    const createdComment = await comment.save();

    const video = await VideoModel.findById(videoId);
    if (!video) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Video not found with given id',
      });
    }

    await video.update({
      numComments: video.numComments + 1,
    });

    return res.status(httpStatus.CREATED).json({
      comment: createdComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error creating new like',
    });
  }
};

videoCommentController.replyComment = async (req, res) => {
  const { userId } = req;
  const { commentId, content } = req.body;

  try {
    const existingComment = await CommentModel.findById(commentId);
    if (!existingComment) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Comment not found with given id',
      });
    }
    if (existingComment.user !== userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        error: 'You are not allowed to modify other person comment',
      });
    }

    const replyComment = new CommentModel({
      video: existingComment.video,
      user: userId,
      content,
    });
    const createdReplyComment = await replyComment.save();

    const repliedComments = existingComment.commentsAnswered || [];
    await existingComment.update({
      commentsAnswered: repliedComments.concat(createdReplyComment._id),
    });

    return res.status(httpStatus.CREATED).json({
      replyComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error creating new like',
    });
  }
};

videoCommentController.edit = async (req, res) => {
  const { userId } = req;
  const { commentId, content } = req.body;

  try {
    const existingComment = await CommentModel.findById(commentId);
    if (!existingComment) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Comment not found with given id',
      });
    }
    if (existingComment.user !== userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        error: 'You are not allowed to modify other person comment',
      });
    }

    const updatedComment = await existingComment.update(
      {
        content,
      },
      {
        new: true,
      },
    );

    return res.status(httpStatus.OK).json({
      updatedComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error creating new like',
    });
  }
};

videoCommentController.remove = async (req, res) => {
  const { userId } = req;
  const { commentId } = req.body;

  try {
    const existingComment = await CommentModel.findById(commentId);
    if (!existingComment) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Comment not found with given id',
      });
    }
    if (existingComment.user !== userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        error: 'You are not allowed to modify other person comment',
      });
    }

    const deletedComment = await CommentModel.findByIdAndDelete(
      existingComment._id,
    );

    return res.status(httpStatus.OK).json({
      deletedComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Error creating new like',
    });
  }
};

module.exports = videoCommentController;
