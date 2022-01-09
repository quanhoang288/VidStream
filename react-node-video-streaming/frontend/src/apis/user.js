import api from './api';

const getInfo = (userId) => api.get(`/users/${userId}`);

const getVideoGallery = (userId) => api.get(`/users/${userId}/videos`);

export { getInfo, getVideoGallery };
