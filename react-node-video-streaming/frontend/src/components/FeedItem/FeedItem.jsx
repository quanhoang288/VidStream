import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteIcon from '@material-ui/icons/Favorite';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import { Button, Divider, IconButton, Typography } from '@material-ui/core';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './FeedItem.css';
import { ASSET_BASE_URL } from '../../configs';
import { showModal } from '../../redux/actions/modalActions';
import { notificationApi, userApi, videoLikeApi } from '../../apis';
import { useWebsocket } from '../../utils/websocket.context';

function FeedItem({ video, shouldRenderVideo }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const socket = useWebsocket();

  const user = useSelector((state) => state.auth.user);
  const [isLiked, setLiked] = useState(video.isLiked || false);
  const [numLikes, setNumLikes] = useState(video.numLikes);
  const [toggleLike, setToggleLike] = useState(false);
  const [isFollowingAuthor, setFollowingAuthor] = useState(false);

  const handleToggleLike = useCallback(async () => {
    if (!user) {
      dispatch(showModal());
    } else {
      try {
        if (isLiked) {
          await videoLikeApi.unlikeVideo(video._id, user.token);
          setNumLikes(numLikes - 1);
        } else {
          await videoLikeApi.likeVideo(video._id, user.token);
          setNumLikes(numLikes + 1);
          if (user.id !== video.uploadedBy._id) {
            const createRes = await notificationApi.create(
              'LIKE_VIDEO',
              video.uploadedBy._id,
              video._id,
              user.token,
            );

            socket?.emit('SEND_NOTIFICATION', createRes.data.notification);
          }
        }
        setLiked(!isLiked);
        setToggleLike(false);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user, isLiked, numLikes, video, socket]);

  const handleRedirectToVideoDetail = useCallback(() => {
    if (!user) {
      dispatch(showModal());
    } else {
      history.push(`/videos/${video._id}/`);
    }
  }, [user, video]);

  const handleToggleFollow = useCallback(async () => {
    if (isFollowingAuthor) {
      await userApi.unfollow(video.uploadedBy._id, user.token);
    } else {
      await userApi.follow(video.uploadedBy._id, user.token);
    }
    setFollowingAuthor(!isFollowingAuthor);
  }, [isFollowingAuthor, user, video]);

  const checkFollowing = async (authUser, authorId) => {
    try {
      const result = await userApi.getFollowingList(
        authUser.id,
        authUser.token,
      );
      const { followingList } = result.data;
      setFollowingAuthor(
        followingList.findIndex((u) => u._id === authorId) !== -1,
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (toggleLike) {
      handleToggleLike();
    }
  }, [toggleLike]);

  useEffect(() => {
    if (video.uploadedBy) {
      checkFollowing(user, video.uploadedBy._id);
    }
  }, [video, user]);

  return (
    <>
      <div className="feed__item__content">
        <div className="author__info">
          <a
            href={`/profile/${video.uploadedBy._id}`}
            className="author__profile"
          >
            <img
              src={
                video.uploadedBy.avatar
                  ? `${ASSET_BASE_URL}/${video.uploadedBy.avatar.fileName}`
                  : null
              }
              alt="Profile"
            />
          </a>
          <a href={`/profile/${video.uploadedBy._id}`} className="author__name">
            <h3>{video.uploadedBy.username}</h3>
          </a>
          <Button
            variant="outlined"
            color={isFollowingAuthor ? 'inherit' : 'secondary'}
            style={{ maxHeight: '30px' }}
            onClick={handleToggleFollow}
          >
            {isFollowingAuthor ? 'Following' : 'Follow'}
          </Button>
        </div>
        <div className="feed__caption">
          <strong>{video.description}</strong>
        </div>
        <div className="video__action__bar">
          {shouldRenderVideo ? (
            <VideoPlayer videoId={video._id} />
          ) : (
            <div className="video__item__container">
              <img
                src={`${ASSET_BASE_URL}/${video.thumbnail.fileName}`}
                alt="Video thumbnail"
                className="video__item__thumbnail"
              />
            </div>
          )}

          <div className="action__bar">
            <div className="text__center like__wrapper">
              <IconButton onClick={() => setToggleLike(true)}>
                <FavoriteIcon color={isLiked ? 'secondary' : 'inherit'} />
              </IconButton>
              <Typography>{numLikes}</Typography>
            </div>
            <div className="text__center comment__wrapper">
              <IconButton onClick={handleRedirectToVideoDetail}>
                <InsertCommentIcon />
              </IconButton>
              <Typography>{video.numComments}</Typography>
            </div>
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
}

export default FeedItem;
