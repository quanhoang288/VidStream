import api from './api';

const create = async (type, to, video = null, token) =>
  video
    ? api.post(
        '/notifications/create',
        {
          type,
          to,
          video,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    : api.post(
        '/notifications/create',
        {
          type,
          to,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

const getNotifications = async (userId, lastObjectId = null, token) =>
  lastObjectId
    ? api.get(
        `/notifications?receiverId=${userId}&lastObjectId=${lastObjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    : api.get(`/notifications?receiverId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
const markUnreadNotifications = async (lastUnreadId, token) =>
  api.post(
    '/notifications/mark_unread',
    { lastUnreadId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export { create, getNotifications, markUnreadNotifications };
