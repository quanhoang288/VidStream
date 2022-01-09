import React, { useEffect, useState } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { useParams } from 'react-router-dom';
import Main from '../../containers/Main/Main';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import './Profile.css';
import { userApi } from '../../apis';

function Profile() {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [userVideos, setUserVideos] = useState([]);

  const params = useParams();

  const fetchUserInfo = async (id) => {
    try {
      const userInfoRes = await userApi.getInfo(id);
      setUserInfo(userInfoRes.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserVideos = async (id) => {
    try {
      const userVideoRes = await userApi.getVideoGallery(id);
      setUserVideos(userVideoRes.data.videoGallery);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('params: ', params);
    if (params && params.userId) {
      setUserId(params.userId);
    }
  }, [params]);

  useEffect(() => {
    if (userId) {
      fetchUserInfo(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (userInfo.username) {
      fetchUserVideos(userId);
    }
  }, [userInfo]);

  return (
    <Main>
      <div className="main__wrapper">
        <div className="profile">
          <div className="profile__image">
            <img
              src="https://img.hoidap247.com/picture/answer/20200402/large_1585798495452.jpg"
              width={200}
              alt="Profile"
            />
          </div>

          <div className="profile__user__settings">
            <h1 className="profile__username">{userInfo.username}</h1>

            <button type="button" className="btn profile__edit__btn">
              Edit Profile
            </button>

            <SettingsIcon className="profile__settings__btn" />
          </div>

          <div className="profile__stats">
            <ul>
              <li>
                <span className="profile__stat__count">
                  {userInfo.numUploadedVideos}
                </span>{' '}
                videos
              </li>
              <li>
                <span className="profile__stat__count">
                  {userInfo.followers ? userInfo.followers.length : null}
                </span>{' '}
                followers
              </li>
              <li>
                <span className="profile__stat__count">
                  {userInfo.following ? userInfo.following.length : null}
                </span>{' '}
                following
              </li>
            </ul>
          </div>
        </div>

        <div className="gallery">
          {userVideos.map((video) => (
            <GalleryItem video={video} key={video._id} />
          ))}
        </div>
      </div>
    </Main>
  );
}

export default Profile;
