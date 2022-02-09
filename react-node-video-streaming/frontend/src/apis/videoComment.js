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

const likeComment = (commentId, token) =>
  api.post(`/comments/${commentId}/like`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const unlikeComment = (commentId, token) =>
  api.post(`/comments/${commentId}/unlike`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export { createComment, removeComment, likeComment, unlikeComment };
