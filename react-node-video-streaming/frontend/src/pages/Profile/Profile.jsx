import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Main from '../../containers/Main/Main';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import FollowList from '../../components/FollowList/FollowList';
import './Profile.css';
import { userApi } from '../../apis';
import { ASSET_BASE_URL } from '../../configs';

function Profile() {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [userVideos, setUserVideos] = useState([]);
  const [curFollowModal, setCurFollowModal] = useState(null);
  const [followList, setFollowList] = useState([]);

  const authUser = useSelector((state) => state.auth.user);

  const params = useParams();
  const history = useHistory();

  const fetchUserInfo = async (id, token) => {
    try {
      const userInfoRes = await userApi.getInfo(id, token);
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

  const fetchFollowerList = async (id, token) => {
    try {
      const result = await userApi.getFollowerList(id, token);
      setFollowList(result.data.followerList);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFollowingList = async (id, token) => {
    try {
      const result = await userApi.getFollowingList(id, token);
      setFollowList(result.data.followingList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleFollow = useCallback(
    async (userIdToToggle, isFollowing) => {
      try {
        if (isFollowing) {
          await userApi.unfollow(userIdToToggle, authUser.token);
        } else {
          await userApi.follow(userIdToToggle, authUser.token);
        }
        setFollowList(
          followList.map((user) => {
            if (user._id !== userIdToToggle) {
              return user;
            }
            return {
              ...user,
              isFollowing: !isFollowing,
            };
          }),
        );
      } catch (error) {
        console.log(error);
      }
    },
    [authUser, followList],
  );

  const handleToggleFollowCurrentUser = useCallback(async () => {
    try {
      if (userInfo.isFollowing) {
        await userApi.unfollow(userInfo._id, authUser.token);
      } else {
        await userApi.follow(userInfo._id, authUser.token);
      }

      setUserInfo({ ...userInfo, isFollowing: !userInfo.isFollowing });
    } catch (error) {
      console.log(error);
    }
  }, [userInfo, authUser]);

  useEffect(() => {
    if (params && params.userId) {
      setUserId(params.userId);
      if (curFollowModal) {
        setCurFollowModal(null);
      }
    }
  }, [params]);

  useEffect(() => {
    if (userId && authUser) {
      fetchUserInfo(userId, authUser.token);
    }
  }, [userId, authUser]);

  useEffect(() => {
    if (userInfo.username) {
      fetchUserVideos(userId);
    }
  }, [userInfo]);

  useEffect(() => {
    if (authUser && userId) {
      if (curFollowModal === 'following') {
        fetchFollowingList(userId, authUser.token);
      } else if (curFollowModal === 'followers') {
        fetchFollowerList(userId, authUser.token);
      }
    }
  }, [curFollowModal, userId, authUser]);

  return (
    <Main>
      {curFollowModal && (
        <FollowList
          title={curFollowModal === 'following' ? 'Following' : 'Followers'}
          users={followList}
          handleClose={() => setCurFollowModal(null)}
          isFollowingList={curFollowModal === 'following'}
          handleToggleFollow={handleToggleFollow}
          isOwnProfile={userId === authUser.id}
        />
      )}
      <div className="main__wrapper">
        <div className="profile">
          <div className="profile__image">
            <img
              src={
                userInfo.avatar
                  ? `${ASSET_BASE_URL}/${userInfo.avatar.fileName}`
                  : null
              }
              width={200}
              alt="Profile"
            />
          </div>

          <div className="profile__user__settings">
            <h1 className="profile__username">{userInfo.username}</h1>
            {userId === authUser.id ? (
              <button
                type="button"
                className="btn profile__edit__btn"
                onClick={() => history.push('/account/edit')}
              >
                Edit Profile
              </button>
            ) : (
              <Button
                type="button"
                variant="outlined"
                color={userInfo.isFollowing ? 'inherit' : 'secondary'}
                onClick={handleToggleFollowCurrentUser}
                style={{ marginLeft: '1rem' }}
              >
                {userInfo.isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>

          <div className="profile__stats">
            <ul>
              <li className="auto__cursor">
                <span className="profile__stat__count">
                  {userInfo.numUploadedVideos}
                </span>{' '}
                videos
              </li>
              <li
                className={
                  userInfo.followers &&
                  userInfo.followers.length === 0 &&
                  'auto__cursor'
                }
                onClick={() => {
                  if (userInfo.followers && userInfo.followers.length > 0) {
                    setCurFollowModal('followers');
                  }
                }}
              >
                <span className="profile__stat__count">
                  {userInfo.followers ? userInfo.followers.length : null}
                </span>{' '}
                followers
              </li>
              <li
                className={
                  userInfo.following &&
                  userInfo.following.length === 0 &&
                  'auto__cursor'
                }
                onClick={() => {
                  if (userInfo.following && userInfo.following.length > 0) {
                    setCurFollowModal('following');
                  }
                }}
              >
                <span className="profile__stat__count">
                  {userInfo.following ? userInfo.following.length : null}
                </span>{' '}
                following
              </li>
            </ul>
          </div>
        </div>

        {userVideos.length === 0 ? (
          <div className="empty__profile">
            <h4>No video yet</h4>
            <p>All posted videos will appear here</p>
          </div>
        ) : (
          <div className="gallery">
            {userVideos.map((video) => (
              <GalleryItem video={video} key={video._id} />
            ))}
          </div>
        )}
      </div>
    </Main>
  );
}

export default Profile;
