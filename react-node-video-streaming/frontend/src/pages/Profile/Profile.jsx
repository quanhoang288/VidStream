import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { InView } from 'react-intersection-observer';
import FadeLoader from 'react-spinners/FadeLoader';

import Main from '../../containers/Main/Main';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import FollowList from '../../components/FollowList/FollowList';
import './Profile.css';
import { notificationApi, userApi } from '../../apis';
import { ASSET_BASE_URL } from '../../configs';
import { showModal } from '../../redux/actions/modalActions';
import { useWebsocket } from '../../utils/websocket.context';

function Profile() {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [userVideos, setUserVideos] = useState([]);
  const [curFollowModal, setCurFollowModal] = useState(null);
  const [followList, setFollowList] = useState([]);
  const [shouldLoadMore, setLoadMore] = useState(false);
  const [lastVideoId, setLastVideoId] = useState(null);

  const authUser = useSelector((state) => state.auth.user);

  const socket = useWebsocket();
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();

  const handleLoadMore = async (user, lastId) => {
    try {
      const result = await userApi.getVideoGallery(user, lastId);
      setUserVideos(userVideos.concat(result.data.videoGallery));
      setLoadMore(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserInfo = async (id, authUserId) => {
    try {
      const userInfoRes = await userApi.getInfo(id, authUserId);
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
      setFollowList(result.data.followers);
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
          const createRes = await notificationApi.create(
            'FOLLOW',
            userIdToToggle,
            authUser.token,
          );
          socket?.emit('SEND_NOTIFICATION', createRes.data.notification);
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
    if (!authUser) {
      dispatch(showModal());
    }
    try {
      if (userInfo.isFollowing) {
        await userApi.unfollow(userInfo._id, authUser.token);
      } else {
        await userApi.follow(userInfo._id, authUser.token);
        const createRes = await notificationApi.create(
          'FOLLOW',
          userInfo._id,
          null,
          authUser.token,
        );
        socket?.emit('SEND_NOTIFICATION', createRes.data.notification);
      }
      setUserInfo({
        ...userInfo,
        numFollowers: userInfo.isFollowing
          ? userInfo.numFollowers - 1
          : userInfo.numFollowers + 1,
        isFollowing: !userInfo.isFollowing,
      });
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
    if (userId) {
      fetchUserInfo(userId, authUser ? authUser.id : null);
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

  useEffect(() => {
    if (userVideos.length > 0) {
      const lastVideo = userVideos[userVideos.length - 1];
      setLastVideoId(lastVideo._id);
    }
  }, [userVideos]);

  useEffect(() => {
    console.log('should load more: ', shouldLoadMore);
    if (shouldLoadMore) {
      handleLoadMore(userId, lastVideoId);
    }
  }, [userId, shouldLoadMore, lastVideoId]);

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
            {authUser && userId === authUser.id ? (
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
                // className={
                //   userInfo.followers &&
                //   userInfo.followers.length === 0 &&
                //   'auto__cursor'
                // }
                // onClick={() => {
                //   if (userInfo.followers && userInfo.followers.length > 0) {
                //     setCurFollowModal('followers');
                //   }
                // }}
                className={
                  (!authUser ||
                    !userInfo.numFollowers ||
                    userInfo.numFollowers === 0) &&
                  'auto__cursor'
                }
                onClick={() => {
                  if (
                    authUser &&
                    userInfo.numFollowers &&
                    userInfo.numFollowers > 0
                  ) {
                    setCurFollowModal('followers');
                  }
                }}
              >
                <span className="profile__stat__count">
                  {/* {userInfo.followers ? userInfo.followers.length : null} */}
                  {userInfo.numFollowers || 0}
                </span>{' '}
                followers
              </li>
              <li
                // className={
                //   userInfo.following &&
                //   userInfo.following.length === 0 &&
                //   'auto__cursor'
                // }
                // onClick={() => {
                //   if (userInfo.following && userInfo.following.length > 0) {
                //     setCurFollowModal('following');
                //   }
                // }}
                className={
                  (!authUser ||
                    !userInfo.numFollowing ||
                    userInfo.numFollowing === 0) &&
                  'auto__cursor'
                }
                onClick={() => {
                  if (
                    authUser &&
                    userInfo.numFollowing &&
                    userInfo.numFollowing > 0
                  ) {
                    setCurFollowModal('following');
                  }
                }}
              >
                <span className="profile__stat__count">
                  {/* {userInfo.following ? userInfo.following.length : null} */}
                  {userInfo.numFollowing || 0}
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
          <>
            <div className="gallery">
              {userVideos.map((video, index) => {
                if (index === userVideos.length - 1) {
                  return (
                    <InView
                      threshold={1}
                      onChange={(inView) => {
                        if (inView) {
                          setLoadMore(true);
                        }
                      }}
                    >
                      <GalleryItem video={video} key={video._id} />
                    </InView>
                  );
                }
                return <GalleryItem video={video} key={video._id} />;
              })}
            </div>
            <div style={{ textAlign: 'center' }}>
              <FadeLoader loading={shouldLoadMore} />
            </div>
          </>
        )}
      </div>
    </Main>
  );
}

export default Profile;
