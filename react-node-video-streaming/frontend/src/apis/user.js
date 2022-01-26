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

const getInfo = (userId, token) =>
  api.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const getVideoGallery = (userId) => api.get(`/users/${userId}/videos`);

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
  follow,
  unfollow,
};
