const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const GoogleDriveService = require('../services/googleDrive');
const {
  GOOGLE_DRIVE_CLIENT_ID,
  GOOGLE_DRIVE_CLIENT_SECRET,
  GOOGLE_DRIVE_REDIRECT_URI,
  GOOGLE_DRIVE_REFRESH_TOKEN,
} = require('../configs');
const removeFolder = require('./removeFolderRecursive');

const uploadFolderToDrive = async (
  folderPath,
  uploadFolderName,
  except = [],
) => {
  if (!fs.existsSync(folderPath)) {
    throw new Error('Folder not found!');
  }

  console.log('folder name: ', uploadFolderName);

  const googleDriveService = new GoogleDriveService(
    GOOGLE_DRIVE_CLIENT_ID,
    GOOGLE_DRIVE_CLIENT_SECRET,
    GOOGLE_DRIVE_REDIRECT_URI,
    GOOGLE_DRIVE_REFRESH_TOKEN,
  );

  let uploadFolder = await googleDriveService.searchFolder(uploadFolderName);
  if (!uploadFolder) {
    try {
      uploadFolder = await googleDriveService.createFolder(uploadFolderName);
    } catch (err) {
      console.log(err);
      throw new Error('Error creating new folder in google drive');
    }
  }

  const files = fs.readdirSync(path.resolve(folderPath));
  const uploadPromises = files
    .filter((file) => !except.includes(file))
    .map(
      (file) =>
        new Promise((resolve, reject) => {
          const extension = path.extname(file);
          const mimeType = mime.contentType(extension);
          googleDriveService
            .saveFile(
              file,
              path.join(folderPath, file),
              mimeType,
              uploadFolder.data.id,
            )
            .then((saveRes) => resolve(saveRes.data))
            .catch((err) => reject(err));
        }),
    );

  const uploadedFiles = await Promise.all(uploadPromises);

  console.log('Folder uploaded successfully!');
  removeFolder(path.resolve(folderPath));

  return uploadedFiles;
};

const uploadFileToDrive = async (filePath, uploadFolderName, mimeType) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found!');
  }

  const googleDriveService = new GoogleDriveService(
    GOOGLE_DRIVE_CLIENT_ID,
    GOOGLE_DRIVE_CLIENT_SECRET,
    GOOGLE_DRIVE_REDIRECT_URI,
    GOOGLE_DRIVE_REFRESH_TOKEN,
  );

  let folder = await googleDriveService.searchFolder(uploadFolderName);
  if (!folder) {
    try {
      folder = await googleDriveService.createFolder(uploadFolderName);
    } catch (err) {
      console.log(err);
      throw new Error('Error creating new folder in google drive!');
    }
  }

  const fileName = path.basename(filePath);
  const result = await googleDriveService.saveFile(
    fileName,
    path.resolve(filePath),
    mimeType,
    folder.data.id,
  );

  console.log('File uploaded successfully!');

  fs.unlinkSync(path.resolve(filePath));

  return result.data;
};

const downloadFileFromDrive = async (fileId) => {
  const googleDriveService = new GoogleDriveService(
    GOOGLE_DRIVE_CLIENT_ID,
    GOOGLE_DRIVE_CLIENT_SECRET,
    GOOGLE_DRIVE_REDIRECT_URI,
    GOOGLE_DRIVE_REFRESH_TOKEN,
  );

  return googleDriveService.downloadFile(fileId);
};

module.exports = {
  downloadFileFromDrive,
  uploadFileToDrive,
  uploadFolderToDrive,
};
