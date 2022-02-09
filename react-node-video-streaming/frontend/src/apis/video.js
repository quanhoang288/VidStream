import api from './api';

const upload = async (data) => {
  const { videoFile, description, restriction, userId } = data;

  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('description', description);
  formData.append('restriction', restriction);
  formData.append('userId', userId);

  const uploadResult = await api({
    method: 'POST',
    url: '/videos/upload',
    data: formData,
  });
  return uploadResult;
};

const editVideo = (
  videoId,
  videoFile = null,
  description,
  restriction,
  token,
) => {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('description', description);
  formData.append('restriction', restriction);

  return api.post(`/videos/${videoId}/edit`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteVideo = (videoId, token) =>
  api.delete(`/videos/${videoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const getInfo = (videoId, userId = null) =>
  userId
    ? api.get(`/videos/${videoId}?userId=${userId}`)
    : api.get(`/videos/${videoId}`);

const getComments = (videoId, lastCommentId = null, token) =>
  lastCommentId
    ? api.get(`/videos/${videoId}/comments?lastObjectId=${lastCommentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    : api.get(`/videos/${videoId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

const getContent = (videoId) => api.get(`/videos/${videoId}/stream`);

const getSuggestedList = (userId = null) =>
  userId
    ? api.get(`/videos/suggestList?userId=${userId}`)
    : api.get('/videos/suggestList');

const getFollowingList = (token) =>
  api.get('/videos/followingList', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export {
  upload,
  getInfo,
  getComments,
  getContent,
  getFollowingList,
  getSuggestedList,
  editVideo,
  deleteVideo,
};
