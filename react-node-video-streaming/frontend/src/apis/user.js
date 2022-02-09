import api from './api';

const editInfo = (editData, token) =>
  api.post('/users/edit', editData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const changePassword = (oldPassword, newPassword, token) =>
  api.post(
    '/users/change-password',
    { oldPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

const changeProfile = (fileInput, token) => {
  const formData = new FormData();
  formData.append('avatar', fileInput);
  return api.post('/users/change-profile', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getInfo = (userId, authUserId = null) =>
  authUserId
    ? api.get(`/users/${userId}?authId=${authUserId}`)
    : api.get(`/users/${userId}`);

const getVideoGallery = (userId, lastVideoId) =>
  lastVideoId
    ? api.get(`/users/${userId}/videos?lastObjectId=${lastVideoId}`)
    : api.get(`/users/${userId}/videos`);

const getSuggestedList = (userId = null) =>
  userId
    ? api.get(`/users/suggestion?userId=${userId}`)
    : api.get('/users/suggestion');

const getFollowingList = (userId, token) =>
  api.get(`/users/${userId}/following`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const getFollowerList = (userId, token) =>
  api.get(`/users/${userId}/followers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const follow = (userId, token) =>
  api.post(
    '/users/follow',
    {
      userIdToFollow: userId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

const unfollow = (userId, token) =>
  api.post(
    '/users/unfollow',
    {
      userIdToUnfollow: userId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export {
  changePassword,
  changeProfile,
  editInfo,
  getInfo,
  getVideoGallery,
  getFollowingList,
  getFollowerList,
  getSuggestedList,
  follow,
  unfollow,
};
