const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const { TMP_UPLOAD_DIR } = require('../configs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const subDir = path.basename(file.originalname).split('.')[0] + '-' + Date.now(); 
        const storageDir = `${TMP_UPLOAD_DIR}/${subDir}`
        fs.mkdirsSync(storageDir);
        cb(null, storageDir);
    },
    filename: (req, file, cb) => {
        cb(null, path.basename(file.originalname).split('.')[0] + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2000 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        validateFileType(file, cb);
    }
});

const validateFileType = (file, cb) => {
    const allowedFileTypes = /webm|mp4/;
    const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);
    
    if (mimeType && extName) {
        return cb(null, true);
    }
    
    cb(new Error('Invalid file extension or unsupported mime type'), false);
}

module.exports = upload;