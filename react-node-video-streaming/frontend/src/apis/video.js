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

const getManifestFile = (videoId) => api.get(`/videos/${videoId}/manifest`);

const getChunk = (videoId, chunkName) =>
  api.get(`/videos/${videoId}/chunks/${chunkName}`, {
    responseType: 'arraybuffer',
  });

export { upload, getChunk, getManifestFile };
