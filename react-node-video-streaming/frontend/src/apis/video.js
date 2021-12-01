import api from './api';

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('video', file);
  const uploadResult = await api({
    method: 'POST',
    url: '/videos/upload',
    data: formData,
  });
  return uploadResult;
};

export { uploadFile };
