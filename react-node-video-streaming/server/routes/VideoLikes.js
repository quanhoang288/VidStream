const express = require('express');
const videoLikeController = require('../controllers/VideoLikes');
const auth = require('../middlewares/auth');

const { asyncWrapper } = require('../utils/asyncWrapper');

const videoLikeRoutes = express.Router();

videoLikeRoutes.post('/create', auth, asyncWrapper(videoLikeController.create));
videoLikeRoutes.post('/remove', auth, asyncWrapper(videoLikeController.remove));

module.exports = videoLikeRoutes;
