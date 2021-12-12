const express = require('express');
const userController = require('../controllers/Users');
const { asyncWrapper } = require('../utils/asyncWrapper');
const auth = require('../middlewares/auth');

const userRoutes = express.Router();

userRoutes.post('/register', asyncWrapper(userController.register));

userRoutes.post('/login', asyncWrapper(userController.login));

userRoutes.get(
  '/:id/videos',
  auth,
  asyncWrapper(userController.getVideoGallery),
);
module.exports = userRoutes;
