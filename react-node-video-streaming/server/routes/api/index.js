const express = require('express');
const videoRoutes = require('../Videos');
const userRoutes = require('../Users');
const videoLikeRoutes = require('../VideoLikes');
const videoCommentRoutes = require('../VideoComments');
const notificationRoutes = require('../Notifications');

const apiRoutes = express.Router();

apiRoutes.use('/users', userRoutes);
apiRoutes.use('/videos', videoRoutes);
apiRoutes.use('/likes', videoLikeRoutes);
apiRoutes.use('/comments', videoCommentRoutes);
apiRoutes.use('/notifications', notificationRoutes);

apiRoutes.get('/', (req, res) => res.json({ api: 'is-working' }));

module.exports = apiRoutes;
