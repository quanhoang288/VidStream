const NotificationModel = require('../models/Notifications');
const httpStatus = require('../utils/httpStatus');

const notificationController = {};

notificationController.create = async (req, res) => {
  const { userId } = req;
  const { to, type, video } = req.body;

  try {
    const notification = new NotificationModel({
      from: userId,
      to,
      type,
      video,
    });
    await notification.save();
    const createdNotification = await NotificationModel.findById(
      notification._id,
    )
      .populate({
        path: 'from',
        select: '_id username',
        populate: {
          path: 'avatar',
          select: '_id fileName',
          model: 'Assets',
        },
        model: 'Users',
      })
      .populate({
        path: 'video',
        select: '_id',
        populate: {
          path: 'thumbnail',
          select: '_id fileName',
          model: 'Assets',
        },
        model: 'Videos',
      });

    return res.status(httpStatus.CREATED).json({
      notification: createdNotification,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating new notification',
    });
  }
};

notificationController.getNotificationsByReceiverId = async (req, res) => {
  const { userId } = req;
  const { receiverId } = req.query;
  const { lastObjectId, limit } = req.paginationParams;
  let lastRetrievedItem;
  let filter = { to: receiverId };

  if (!receiverId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Must provide receiver id',
    });
  }
  if (userId !== receiverId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Cannot see other person notifications',
    });
  }
  try {
    if (lastObjectId) {
      lastRetrievedItem = await NotificationModel.findById(lastObjectId);
      if (lastRetrievedItem) {
        filter = {
          ...filter,
          createdAt: {
            $lt: lastRetrievedItem.createdAt,
          },
        };
      }
    }

    const notifications = await NotificationModel.find(filter)
      .populate({
        path: 'from',
        select: '_id username',
        populate: {
          path: 'avatar',
          select: '_id fileName',
          model: 'Assets',
        },
        model: 'Users',
      })
      .populate({
        path: 'video',
        select: '_id',
        populate: {
          path: 'thumbnail',
          select: '_id fileName',
          model: 'Assets',
        },
        model: 'Videos',
      })
      .sort({ createdAt: -1 })
      .limit(limit);
    return res.status(httpStatus.OK).json({
      notifications,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error getting notifications',
    });
  }
};

notificationController.markAllUnreadNotifications = async (req, res) => {
  const { userId } = req;
  // const { lastUnreadId } = req.body;
  try {
    // const lastUnreadNotification = await NotificationModel.findById(
    //   lastUnreadId,
    // );
    const now = new Date();
    await NotificationModel.updateMany(
      {
        to: userId,
        // $gte: {
        //   createdAt: lastUnreadNotification.createdAt,
        // },
      },
      { readAt: now },
    );
    return res.status(httpStatus.OK).json({
      message: 'Update successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error reading unread notifications',
    });
  }
};

module.exports = notificationController;
