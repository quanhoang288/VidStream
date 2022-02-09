const VideoModel = require('../models/Videos');
const CommentModel = require('../models/Comments');
const CommentLikeModel = require('../models/CommentLikes');
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

videoCommentController.likeComment = async (req, res) => {
  const { userId } = req;
  const { commentId } = req.params;

  try {
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Comment not found',
      });
    }

    const existingLike = await CommentLikeModel.findOne({
      user: userId,
      comment: commentId,
    });

    if (existingLike) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Already liked the comment',
      });
    }

    const newLike = new CommentLikeModel({
      user: userId,
      comment: commentId,
    });
    await newLike.save();
    await comment.update({
      numLikes: comment.numLikes ? comment.numLikes + 1 : 1,
    });

    return res.status(httpStatus.CREATED).json({
      newLike,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error liking comment',
    });
  }
};

videoCommentController.unlikeComment = async (req, res) => {
  const { userId } = req;
  const { commentId } = req.params;

  try {
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Comment not found',
      });
    }
    const existingLike = await CommentLikeModel.findOne({
      user: userId,
      comment: commentId,
    });

    if (!existingLike) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Not liked the comment yet',
      });
    }

    await CommentLikeModel.findByIdAndDelete(existingLike._id);
    await comment.update({
      numLikes: comment.numLikes ? comment.numLikes - 1 : 0,
    });

    return res.status(httpStatus.OK).json({
      message: 'Unlike comment successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error liking comment',
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
