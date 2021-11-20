require('dotenv').config();

// asset types
const ASSET_TYPE_AVATAR = 'avatar';
const ASSET_TYPE_CHUNK = 'chunk';
const ASSET_TYPE_THUMBNAIL = 'thumnail';

// notification types
const NOTIFICATION_TYPE_LIKE = 'like';
const NOTIFICATION_TYPE_COMMENT = 'comment';

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;


module.exports = {
    ASSET_TYPE_AVATAR,
    ASSET_TYPE_CHUNK,
    ASSET_TYPE_THUMBNAIL,
    NOTIFICATION_TYPE_COMMENT,
    NOTIFICATION_TYPE_LIKE,
    JWT_SECRET,
    MONGO_URI,
    PORT
}