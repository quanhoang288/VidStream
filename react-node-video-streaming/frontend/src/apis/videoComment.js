import api from './api';

const createComment = (videoId, content, token) =>
  api.post(
    '/comments/create',
    { videoId, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

const removeComment = (commentId, token) =>
  api.post(
    '/comments/remove',
    { commentId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export { createComment, removeComment };
