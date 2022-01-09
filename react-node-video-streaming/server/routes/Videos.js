const express = require('express');
const videoController = require('../controllers/Videos');
const upload = require('../middlewares/fileUpload');
const { asyncWrapper } = require('../utils/asyncWrapper');

const videoRoutes = express.Router();

videoRoutes.get('/:videoId/test', asyncWrapper(videoController.test));

videoRoutes.post(
  '/upload',
  upload.single('video'),
  asyncWrapper(videoController.upload),
);

videoRoutes.get('/:videoId/stream', asyncWrapper(videoController.getStream));

videoRoutes.get('/:videoId', asyncWrapper(videoController.show));

videoRoutes.get(
  '/:videoId/comments',
  asyncWrapper(videoController.getComments),
);

videoRoutes.get(
  '/:videoId/manifest',
  asyncWrapper(videoController.getManifestFile),
);

videoRoutes.get(
  '/:videoId/chunks/:chunkName',
  asyncWrapper(videoController.downloadVideoChunk),
);
module.exports = videoRoutes;
