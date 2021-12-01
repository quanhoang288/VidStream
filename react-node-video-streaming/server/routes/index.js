const express = require('express');
const apiRoutes = require('./api');

const mainRouter = express.Router();

mainRouter.use('/api/v1', apiRoutes);

module.exports = mainRouter;
