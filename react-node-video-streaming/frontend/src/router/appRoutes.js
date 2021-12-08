// import VideoUpload from '../pages/VideoUpload/VideoUpload';
import Home from '../pages/Home/Home';
import Profile from '../pages/Profile/Profile';

import routes from '../constants/route';

export default [
  {
    path: routes.VIDEO_UPLOAD,
    component: Profile,
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
];
