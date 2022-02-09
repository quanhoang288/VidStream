const express = require('express');
const notificationController = require('../controllers/Notifications');
const auth = require('../middlewares/auth');
const pagination = require('../middlewares/pagination');

const { asyncWrapper } = require('../utils/asyncWrapper');

const notificationRoutes = express.Router();

notificationRoutes.get(
  '/',
  auth,
  pagination,
  asyncWrapper(notificationController.getNotificationsByReceiverId),
);

notificationRoutes.post(
  '/create',
  auth,
  asyncWrapper(notificationController.create),
);

notificationRoutes.post(
  '/mark_unread',
  auth,
  asyncWrapper(notificationController.markAllUnreadNotifications),
);

module.exports = notificationRoutes;
