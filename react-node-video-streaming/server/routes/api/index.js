const express = require('express');
const videoRoutes = require('../Videos');
const userRoutes = require('../Users');

const apiRoutes = express.Router();

apiRoutes.use('/users', userRoutes);
apiRoutes.use('/videos', videoRoutes);

apiRoutes.get('/', (req, res) => res.json({ api: 'is-working' }));

module.exports = apiRoutes;
