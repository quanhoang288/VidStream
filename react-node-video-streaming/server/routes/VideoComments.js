const express = require('express');
const videoCommentController = require('../controllers/VideoComments');
const auth = require('../middlewares/auth');

const { asyncWrapper } = require('../utils/asyncWrapper');

const videoCommentRoutes = express.Router();

videoCommentRoutes.post(
  '/create',
  auth,
  asyncWrapper(videoCommentController.create),
);

videoCommentRoutes.post(
  '/create-reply',
  auth,
  asyncWrapper(videoCommentController.replyComment),
);

videoCommentRoutes.post(
  '/edit',
  auth,
  asyncWrapper(videoCommentController.create),
);

videoCommentRoutes.post(
  '/remove',
  auth,
  asyncWrapper(videoCommentController.remove),
);

videoCommentRoutes.post(
  '/:commentId/like',
  auth,
  asyncWrapper(videoCommentController.likeComment),
);

videoCommentRoutes.post(
  '/:commentId/unlike',
  auth,
  asyncWrapper(videoCommentController.unlikeComment),
);

module.exports = videoCommentRoutes;
