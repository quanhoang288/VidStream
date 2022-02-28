import { notificationApi } from '../../apis';

export const NOTIFICATION_ACTION_TYPES = {
  saveList: 'SAVE_LIST',
  updateList: 'UPDATE_LIST',
  markUnread: 'MARK_ALL_UNREAD',
};

const saveNotificationList = (notifications) => ({
  type: NOTIFICATION_ACTION_TYPES.saveList,
  payload: notifications,
});

const fetchNotification = (userId, token) => async (dispatch) => {
  try {
    const fetchResult = await notificationApi.getNotifications(
      userId,
      null,
      token,
    );
    dispatch(saveNotificationList(fetchResult.data.notifications));
  } catch (err) {
    console.log(err);
  }
};

const markAllUnreadNotifications =
  (lastUnreadId, token) => async (dispatch) => {
    try {
      await notificationApi.markUnreadNotifications(lastUnreadId, token);
      dispatch({
        type: NOTIFICATION_ACTION_TYPES.markUnread,
      });
    } catch (err) {
      console.log(err);
    }
  };

const updateNotificationList = (newNotification) => ({
  type: NOTIFICATION_ACTION_TYPES.updateList,
  payload: newNotification,
});

export {
  saveNotificationList,
  fetchNotification,
  markAllUnreadNotifications,
  updateNotificationList,
};
