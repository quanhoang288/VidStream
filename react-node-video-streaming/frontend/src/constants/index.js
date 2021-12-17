const LOGIN_MODAL = 'login';
const REGISTER_MODAL = 'register';
const DEFAULT_VIDEO_PRIORITIES = [
  '[mimeType="video/mp4"]',
  '[mimeType="video/webm"][codecs^="vp09"]',
  '[mimeType="video/webm"]',
  '',
];
const DEFAULT_AUDIO_PRIORITIES = ['[mimeType="audio/mp4"]', ''];
const ALL_STREAM_TYPES = ['audio', 'video'];

export {
  LOGIN_MODAL,
  REGISTER_MODAL,
  DEFAULT_AUDIO_PRIORITIES,
  DEFAULT_VIDEO_PRIORITIES,
  ALL_STREAM_TYPES,
};
