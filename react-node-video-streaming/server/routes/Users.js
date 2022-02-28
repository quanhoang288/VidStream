const express = require('express');
const userController = require('../controllers/Users');
const { asyncWrapper } = require('../utils/asyncWrapper');
const auth = require('../middlewares/auth');
const imageUpload = require('../middlewares/imageUpload');
const pagination = require('../middlewares/pagination');

const userRoutes = express.Router();

userRoutes.post('/register', asyncWrapper(userController.register));
userRoutes.post('/login', asyncWrapper(userController.login));
userRoutes.post('/edit', auth, asyncWrapper(userController.editInfo));
userRoutes.post(
  '/change-password',
  auth,
  asyncWrapper(userController.changePassword),
);
userRoutes.post(
  '/change-profile',
  auth,
  imageUpload.single('avatar'),
  asyncWrapper(userController.changeProfile),
);
userRoutes.get('/suggestion', asyncWrapper(userController.getSuggestedList));

userRoutes.get('/:id', asyncWrapper(userController.show));

userRoutes.get(
  '/:id/videos',
  pagination,
  asyncWrapper(userController.getVideoGallery),
);

userRoutes.get(
  '/:id/followers',
  auth,
  asyncWrapper(userController.getFollowerList),
);
userRoutes.get(
  '/:id/following',
  auth,
  asyncWrapper(userController.getFollowingList),
);

userRoutes.post('/follow', auth, asyncWrapper(userController.follow));
userRoutes.post('/unfollow', auth, asyncWrapper(userController.unfollow));

module.exports = userRoutes;
