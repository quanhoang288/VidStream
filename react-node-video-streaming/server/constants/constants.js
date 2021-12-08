require('dotenv').config();

// asset types
const ASSET_TYPE_AVATAR = 'avatar';
const ASSET_TYPE_CHUNK = 'chunk';
const ASSET_TYPE_MANIFEST = 'manifest';
const ASSET_TYPE_THUMBNAIL = 'thumnail';

// notification types
const NOTIFICATION_TYPE_LIKE = 'like';
const NOTIFICATION_TYPE_COMMENT = 'comment';

// video status
const VIDEO_STATUS_DRAFT = 'draft';
const VIDEO_STATUS_PUBLISHED = 'published';
const VIDEO_STATUS_DELETED = 'deleted';

// video access mode
const VIDEO_MODE_PUBLIC = 'public';
const VIDEO_MODE_PRIVATE = 'private';

module.exports = {
  ASSET_TYPE_AVATAR,
  ASSET_TYPE_CHUNK,
  ASSET_TYPE_MANIFEST,
  ASSET_TYPE_THUMBNAIL,
  NOTIFICATION_TYPE_COMMENT,
  NOTIFICATION_TYPE_LIKE,
  VIDEO_STATUS_DRAFT,
  VIDEO_STATUS_PUBLISHED,
  VIDEO_STATUS_DELETED,
  VIDEO_MODE_PRIVATE,
  VIDEO_MODE_PUBLIC,
};
