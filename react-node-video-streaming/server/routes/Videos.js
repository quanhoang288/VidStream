const express = require('express');
const videoController = require('../controllers/Videos');
const upload = require('../middlewares/fileUpload');
const auth = require('../middlewares/auth');

const pagination = require('../middlewares/pagination');
const { asyncWrapper } = require('../utils/asyncWrapper');

const videoRoutes = express.Router();

videoRoutes.get('/:videoId/test', asyncWrapper(videoController.test));

videoRoutes.post(
  '/upload',
  upload.single('video'),
  asyncWrapper(videoController.upload),
);

videoRoutes.post(
  '/:videoId/edit',
  auth,
  upload.single('video'),
  asyncWrapper(videoController.edit),
);

videoRoutes.delete('/:videoId', auth, videoController.delete);

videoRoutes.get('/suggestList', asyncWrapper(videoController.getSuggestedList));

videoRoutes.get(
  '/followingList',
  asyncWrapper(videoController.getFollowingVideos),
);

videoRoutes.get('/:videoId/stream', asyncWrapper(videoController.getStream));

videoRoutes.get('/:videoId', asyncWrapper(videoController.show));

videoRoutes.get(
  '/:videoId/comments',
  auth,
  pagination,
  asyncWrapper(videoController.getComments),
);

module.exports = videoRoutes;
