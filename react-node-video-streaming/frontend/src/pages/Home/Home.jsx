import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Main from '../../containers/Main/Main';
import Sidebar from '../../components/Sidebar/Sidebar';
import VideoFeed from '../../components/VideoFeed/VideoFeed';
import './Home.css';

import { userApi, videoApi } from '../../apis';
import { useWebsocket } from '../../utils/websocket.context';
import {
  fetchNotification,
  updateNotificationList,
} from '../../redux/actions/notficationActions';

function Home() {
  const { t } = useTranslation();

  const VIDEO_LIST_OPTIONS = [
    { value: 'suggestion', label: t('SUGGESTED_VIDEOS') },
    { value: 'following', label: t('FOLLOWING_VIDEOS') },
  ];

  const [videos, setVideos] = useState([]);
  const [suggestedAccounts, setSuggestedAccounts] = useState([]);
  const [videoListOption, setVideoListOption] = useState(
    VIDEO_LIST_OPTIONS[0].value,
  );
  const [shouldLoadMore, setLoadMore] = useState(false);
  const [lastVideoId, setLastVideoId] = useState(null);

  const socket = useWebsocket();

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const handleLoadMore = async (lastId) => {
    try {
      const result = await videoApi.getSuggestedList(lastId);
      setVideos(videos.concat(result.data.suggestedList));
      setLoadMore(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuggestedList = async (userId) => {
    try {
      const result = await videoApi.getSuggestedList(userId);
      setVideos(result.data.suggestedList);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFollowingVideos = async (token) => {
    try {
      const result = await videoApi.getFollowingList(token);
      setVideos(result.data.followingVideos);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuggestedAccounts = async (userId) => {
    try {
      const result = await userApi.getSuggestedList(userId);
      setSuggestedAccounts(result.data.suggestedList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (authUser) {
      dispatch(fetchNotification(authUser.id, authUser.token));
    }
    fetchSuggestedAccounts(authUser ? authUser.id : null);
  }, [authUser]);

  useEffect(() => {
    socket?.on('NEW_NOTIFICATION', (newNotification) => {
      const receiverId = newNotification.to;
      if (authUser && authUser.id === receiverId) {
        dispatch(updateNotificationList(newNotification));
      }
    });
  }, [socket, authUser]);

  useEffect(() => {
    if (videos.length > 0) {
      const lastVideo = videos[videos.length - 1];
      setLastVideoId(lastVideo._id);
    }
  }, [videos]);

  useEffect(() => {
    if (videoListOption === 'suggestion') {
      fetchSuggestedList(authUser ? authUser.id : null);
    } else if (authUser) {
      fetchFollowingVideos(authUser.token);
    } else {
      setVideos([]);
    }
  }, [authUser, videoListOption]);

  useEffect(() => {
    if (shouldLoadMore) {
      handleLoadMore(lastVideoId);
    }
  }, [shouldLoadMore, lastVideoId]);

  return (
    <Main>
      <div className="home__container">
        <Sidebar
          suggestedAccounts={suggestedAccounts}
          selectedVideoOption={videoListOption}
          videoListOptions={VIDEO_LIST_OPTIONS}
          onSelectVideoOption={(val) => setVideoListOption(val)}
        />
        <VideoFeed
          type={videoListOption}
          onEndReached={() => setLoadMore(true)}
          videos={videos}
        />
      </div>
    </Main>
  );
}

export default Home;
