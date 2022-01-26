// import VideoUpload from '../pages/VideoUpload/VideoUpload';
import Home from '../pages/Home/Home';
import Profile from '../pages/Profile/Profile';

import routes from '../constants/route';
import VideoUpload from '../pages/VideoUpload/VideoUpload';
import VideoDetail from '../pages/VideoDetail/VideoDetail';
import EditProfile from '../pages/EditProfile/EditProfile';

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
    path: routes.VIDEO_DETAIL,
    component: VideoDetail,
    exact: true,
    isPrivate: false,
  },
  {
    path: routes.EDIT_PROFILE,
    component: EditProfile,
    exact: true,
    isPrivate: false,
  },
];
