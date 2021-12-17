// import VideoUpload from '../pages/VideoUpload/VideoUpload';
import Home from '../pages/Home/Home';
import Profile from '../pages/Profile/Profile';

import routes from '../constants/route';
import VideoUpload from '../pages/VideoUpload/VideoUpload';
import TestPage from '../pages/TestPage';

export default [
  {
    path: routes.VIDEO_UPLOAD,
    component: VideoUpload,
    exact: true,
    isPrivate: false,
  },
  {
    path: routes.PROFILE,
    component: Profile,
    exact: true,
    isPrivate: false,
  },
  {
    path: routes.HOME,
    component: Home,
    exact: true,
    isPrivate: false,
  },
  {
    path: '/streaming-test',
    component: TestPage,
    exact: true,
    isPrivate: false,
  },
];
