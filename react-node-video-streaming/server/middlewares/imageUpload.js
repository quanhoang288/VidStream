const multer = require('multer');
const path = require('path');

const { ASSET_DIR } = require('../configs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ASSET_DIR);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${
        path.basename(file.originalname).split('.')[0]
      }-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    validateFileType(file, cb);
  },
});

const validateFileType = (file, cb) => {
  const allowedFileTypes = /jpg|jpeg|png/;
  const extName = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimeType = allowedFileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  }

  return cb(
    new Error('Invalid file extension or unsupported mime type'),
    false,
  );
};

module.exports = imageUpload;
