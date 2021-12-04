import VideoUpload from '../pages/VideoUpload/VideoUpload';
import Home from '../pages/Home/Home';

import routes from '../constants/route';

export default [
  {
    path: routes.VIDEO_UPLOAD,
    component: VideoUpload,
    exact: true,
    isPrivate: false,
  },
  {
    path: routes.HOME,
    component: Home,
    exact: true,
    isPrivate: false,
  },
];
