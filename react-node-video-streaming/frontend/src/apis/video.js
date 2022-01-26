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

const getInfo = (videoId) => api.get(`/videos/${videoId}`);

const getComments = (videoId) => api.get(`/videos/${videoId}/comments`);

const getContent = (videoId) => api.get(`/videos/${videoId}/stream`);

const getSuggestedList = () => api.get('/videos/suggestList');

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
};
