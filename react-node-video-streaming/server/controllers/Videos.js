const VideoModel = require('../models/Videos');
const httpStatus = require('../utils/httpStatus');
const fs = require('fs');
const path = require('path');
const { encode, generateThumbnail } = require('../services/ffmpeg');
const { uploadFolderToDrive } = require('../utils/cloudUpload');

const videoController = {};

videoController.upload = async (req, res) => {
    try {
        const video = req.file;
        
        //generate thumbnail and encode video in DASH format
        const thumbnail = await generateThumbnail(video);
        const storageDir = await encode(video);
        
        // upload generated files to google drive
        const uploadedFiles = await uploadFolderToDrive(storageDir, storageDir.split('/')[1]);
        
        //TODO: save in DB after succesful upload
        res.status(httpStatus.OK)
            .json({ message: 'Upload successfully!' });
    } catch (err) {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: err.message });
    }
}

module.exports = videoController;