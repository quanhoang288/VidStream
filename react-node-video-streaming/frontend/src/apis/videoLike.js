import api from './api';

const likeVideo = (videoId, token) =>
  api.post(
    '/likes/create',
    { videoId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

const unlikeVideo = (videoId, token) =>
  api.post(
    '/likes/remove',
    { videoId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export { likeVideo, unlikeVideo };
