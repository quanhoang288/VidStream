import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FavoriteIcon from '@material-ui/icons/Favorite';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import {
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { InView } from 'react-intersection-observer';
import PulseLoader from 'react-spinners/PulseLoader';
import CancelIcon from '@material-ui/icons/Cancel';

import { useTranslation } from 'react-i18next';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import VideoEdit from '../../containers/VideoEdit/VideoEdit';
import './VideoDetail.css';

import {
  notificationApi,
  userApi,
  videoApi,
  videoCommentApi,
  videoLikeApi,
} from '../../apis';
import { ASSET_BASE_URL } from '../../configs';
import { showModal } from '../../redux/actions/modalActions';
import AuthHandler from '../../containers/AuthHandler/AuthHandler';
import MenuPopover from '../../components/MenuPopover/MenuPopover';
import ConfirmDialog from '../../components/Modal/ConfirmDialog';
import { useWebsocket } from '../../utils/websocket.context';
import { convertToDateDistance } from '../../utils/date';

function CommentItem({ comment, handleToggleLikeComment }) {
  return (
    <div className="comment__item">
      <a
        href={`/profile/${comment.user._id}`}
        className="comment__item__avatar"
      >
        <img
          src={
            comment.user.avatar
              ? `${ASSET_BASE_URL}/${comment.user.avatar.fileName}`
              : `${ASSET_BASE_URL}/no_avatar.jpg`
          }
          alt="Profile"
          width={50}
        />
      </a>

      <div className="comment__item__content">
        <a
          href={`/profile/${comment.user._id}`}
          className="comment__item__username"
        >
          <span>{comment.user.username}</span>
        </a>
        <p className="comment__text__content">{comment.content}</p>
        <div className="comment__item__timestamp">
          {convertToDateDistance(comment.createdAt)}
        </div>
      </div>

      <div className="comment__item__like">
        <IconButton
          onClick={() => handleToggleLikeComment(comment._id, comment.isLiked)}
        >
          <FavoriteIcon color={comment.isLiked ? 'secondary' : 'inherit'} />
        </IconButton>
        <span>{comment.numLikes || 0}</span>
      </div>
    </div>
  );
}

function VideoDetail() {
  const params = useParams();

  const [videoId, setVideoId] = useState(params ? params.videoId : null);
  const [commentText, setCommentText] = useState('');
  const [videoInfo, setVideoInfo] = useState({});
  const [videoComments, setVideoComments] = useState([]);
  const [isFollowingAuthor, setFollowingAuthor] = useState(false);
  const [isAdvanceMenuVisible, setAdvanceMenuVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [shouldLoadMore, setLoadMore] = useState(false);
  const [lastCommentId, setLastCommentId] = useState(false);

  const { t } = useTranslation(['auth', 'upload', 'translation']);

  const advanceRef = useRef(null);
  const commentSectionRef = useRef(null);
  const firstCommentRef = useRef(null);

  const history = useHistory();

  const socket = useWebsocket();

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const fetchVideoInfo = async (id, userId) => {
    try {
      const fetchResult = await videoApi.getInfo(id, userId);
      setVideoInfo(fetchResult.data.video);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVideoComments = useCallback(
    async (id) => {
      try {
        const fetchResult = await videoApi.getComments(id, null, user.token);
        setVideoComments(fetchResult.data.comments);
      } catch (error) {
        console.log(error);
      }
    },
    [user, videoComments],
  );

  const handleLoadMore = useCallback(
    async (id, lastId) => {
      try {
        const result = await videoApi.getComments(id, lastId, user.token);
        setVideoComments(videoComments.concat(result.data.comments));
        setLoadMore(false);
      } catch (err) {
        console.log(err);
      }
    },
    [user, videoComments],
  );

  const handleToggleFollow = useCallback(async () => {
    if (!user) {
      dispatch(showModal());
      return;
    }
    if (isFollowingAuthor) {
      await userApi.unfollow(videoInfo.uploadedBy._id, user.token);
    } else {
      await userApi.follow(videoInfo.uploadedBy._id, user.token);
      const createRes = await notificationApi.create(
        'FOLLOW',
        videoInfo.uploadedBy._id,
        null,
        user.token,
      );
      socket.emit('SEND_NOTIFICATION', createRes.data.notification);
    }
    setFollowingAuthor(!isFollowingAuthor);
  }, [isFollowingAuthor, user, videoInfo]);

  const handleToggleLike = useCallback(async () => {
    if (!user) {
      dispatch(showModal());
      return;
    }
    try {
      if (videoInfo.isLiked) {
        await videoLikeApi.unlikeVideo(videoInfo._id, user.token);
      } else {
        await videoLikeApi.likeVideo(videoInfo._id, user.token);
        if (user.id !== videoInfo.uploadedBy._id) {
          const createRes = await notificationApi.create(
            'LIKE_VIDEO',
            videoInfo.uploadedBy._id,
            videoInfo._id,
            user.token,
          );
          socket.emit('SEND_NOTIFICATION', createRes.data.notification);
        }
      }
      setVideoInfo({
        ...videoInfo,
        isLiked: !videoInfo.isLiked,
        numLikes: videoInfo.isLiked
          ? videoInfo.numLikes - 1
          : videoInfo.numLikes + 1,
      });
    } catch (error) {
      console.log(error);
    }
  }, [user, videoInfo]);

  const handleComment = useCallback(async () => {
    setCommentText('');
    try {
      const result = await videoCommentApi.createComment(
        videoId,
        commentText,
        user.token,
      );
      if (user.id !== videoInfo.uploadedBy._id) {
        const createRes = await notificationApi.create(
          'COMMENT',
          videoInfo.uploadedBy._id,
          videoInfo._id,
          user.token,
        );
        socket.emit('SEND_NOTIFICATION', createRes.data.notification);
      }
      const createdComment = result.data.comment;
      setVideoComments([
        {
          ...createdComment,
          user: {
            username: user.username,
            avatar: user.avatar,
          },
        },
        ...videoComments,
      ]);
      setVideoInfo({ ...videoInfo, numComments: videoInfo.numComments + 1 });
      if (firstCommentRef.current) {
        firstCommentRef.current.scrollIntoView();
      }
    } catch (error) {
      console.log(error);
    }
  }, [commentSectionRef, commentText, videoId, user]);

  const handleToggleLikeComment = useCallback(
    async (commentId, isCurLiked) => {
      try {
        if (isCurLiked) {
          await videoCommentApi.unlikeComment(commentId, user.token);
        } else {
          await videoCommentApi.likeComment(commentId, user.token);
        }
        setVideoComments(
          videoComments.map((comment) =>
            comment._id !== commentId
              ? comment
              : {
                  ...comment,
                  isLiked: !isCurLiked,
                  numLikes: isCurLiked
                    ? Math.max((comment.numLikes || 0) - 1, 0)
                    : (comment.numLikes || 0) + 1,
                },
          ),
        );
      } catch (error) {
        console.log(error);
      }
    },
    [user, videoComments],
  );

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

  const handleDeleteVideo = useCallback(async () => {
    try {
      await videoApi.deleteVideo(videoId, user.token);
      setDeleteConfirmVisible(false);
      history.push(`/profile/${user.id}`);
    } catch (error) {
      console.log(error);
    }
  }, [videoId, user]);

  const handleRefresh = (updatedPost) => {
    setEditModalVisible(false);
    setVideoInfo({
      ...videoInfo,
      _id: updatedPost._id,
      description: updatedPost.description,
      restriction: updatedPost.restriction,
    });
  };

  useEffect(() => {
    if (params && params.videoId) {
      setVideoId(params.videoId);
    }
  }, [params]);

  useEffect(() => {
    if (videoId) {
      if (user) {
        fetchVideoInfo(videoId, user.id);
        fetchVideoComments(videoId);
      } else {
        fetchVideoInfo(videoId);
      }
    }
  }, [user, videoId]);

  useEffect(() => {
    if (isEditModalVisible && !isAdvanceMenuVisible) {
      setAdvanceMenuVisible(false);
    }
  }, [isEditModalVisible, isAdvanceMenuVisible]);

  useEffect(() => {
    if (user && videoInfo.uploadedBy) {
      checkFollowing(user, videoInfo.uploadedBy._id);
    }
  }, [user, videoInfo]);

  useEffect(() => {
    if (videoComments.length > 0) {
      const lastComment = videoComments[videoComments.length - 1];
      setLastCommentId(lastComment._id);
    }
  }, [videoComments]);

  useEffect(() => {
    console.log('load more: ', shouldLoadMore);
    if (shouldLoadMore) {
      handleLoadMore(videoId, lastCommentId);
    }
  }, [videoId, shouldLoadMore, lastCommentId]);

  return (
    <>
      <AuthHandler />
      <VideoEdit
        videoId={videoId}
        videoInfo={videoInfo}
        isModalVisible={isEditModalVisible}
        handleClose={() => setEditModalVisible(false)}
        onSuccess={handleRefresh}
      />
      <ConfirmDialog
        title={t('DELETE_TITLE', { ns: 'upload' })}
        description={t('DELETE_DESCRIPTION', { ns: 'upload' })}
        confirmTitle={t('DELETE_BUTTON', { ns: 'upload' })}
        cancelTitle={t('CANCEL_BUTTON', { ns: 'upload' })}
        isModalVisible={isDeleteConfirmVisible}
        handleCancel={() => setDeleteConfirmVisible(false)}
        handleConfirm={handleDeleteVideo}
      />
      <div className="video__detail__container">
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
          }}
        >
          <IconButton onClick={() => history.goBack()}>
            <CancelIcon color="action" fontSize="large" />
          </IconButton>
        </div>
        <div
          style={{
            width: '70%',
            position: 'relative',
          }}
        >
          <div className="video__player__container">
            <VideoPlayer
              // showBackButton={true}
              handleBack={() => history.goBack()}
              videoId={videoId}
              poster={
                videoInfo.thumbnail
                  ? `${ASSET_BASE_URL}/${videoInfo.thumbnail.fileName}`
                  : null
              }
            />
          </div>
        </div>
        <div className="video__meta__info">
          <div className="info__container">
            <div className="video__author__info">
              <a
                href={
                  videoInfo.uploadedBy
                    ? `/profile/${videoInfo.uploadedBy._id}`
                    : '#'
                }
                className="comment__item__avatar"
              >
                <img
                  src={
                    videoInfo.uploadedBy && videoInfo.uploadedBy.avatar
                      ? `${ASSET_BASE_URL}/${videoInfo.uploadedBy.avatar.fileName}`
                      : `${ASSET_BASE_URL}/no_avatar.jpg`
                  }
                  alt="Profile"
                  width={50}
                />
              </a>
              <a
                href={
                  videoInfo.uploadedBy
                    ? `/profile/${videoInfo.uploadedBy._id}`
                    : '#'
                }
                className="author__name"
              >
                <span>
                  {videoInfo.uploadedBy ? videoInfo.uploadedBy.username : null}
                </span>
              </a>
              {(!user ||
                (videoInfo.uploadedBy &&
                  videoInfo.uploadedBy._id !== user.id)) && (
                <Button
                  variant="outlined"
                  color={isFollowingAuthor ? 'inherit' : 'secondary'}
                  style={{ maxHeight: '30px' }}
                  onClick={handleToggleFollow}
                >
                  {isFollowingAuthor
                    ? t('FOLLOWING_BUTTON', { ns: 'translation' })
                    : t('FOLLOW_BUTTON', { ns: 'translation' })}
                </Button>
              )}
              {user &&
                videoInfo.uploadedBy &&
                videoInfo.uploadedBy._id === user.id && (
                  <IconButton
                    ref={advanceRef}
                    onClick={() => setAdvanceMenuVisible(true)}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                )}
              <MenuPopover
                anchorEl={advanceRef.current}
                open={isAdvanceMenuVisible}
                onClose={() => setAdvanceMenuVisible(false)}
              >
                <MenuItem
                  onClick={() => {
                    setAdvanceMenuVisible(false);
                    setEditModalVisible(true);
                  }}
                >
                  {t('EDIT_TITLE', { ns: 'upload' })}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAdvanceMenuVisible(false);
                    setDeleteConfirmVisible(true);
                  }}
                >
                  {t('DELETE_TITLE', { ns: 'upload' })}
                </MenuItem>
              </MenuPopover>
            </div>
            <div className="video__item__description">
              <span>{videoInfo.description}</span>
            </div>
            <div className="like__comment__button__group">
              <div>
                <IconButton onClick={handleToggleLike}>
                  <FavoriteIcon
                    color={videoInfo.isLiked ? 'secondary' : 'inherit'}
                  />
                </IconButton>
                <strong>{videoInfo.numLikes}</strong>
              </div>
              <div>
                <IconButton>
                  <InsertCommentIcon />
                </IconButton>
                <strong>{videoInfo.numComments}</strong>
              </div>
            </div>
          </div>

          {user ? (
            <>
              <div className="comment__section" ref={commentSectionRef}>
                {videoComments.length === 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h5">
                      {t('NO_COMMENT', { ns: 'translation' })}
                    </Typography>
                  </div>
                ) : (
                  videoComments.map((comment, idx) =>
                    idx === 0 ? (
                      <div key={comment._id} ref={firstCommentRef}>
                        <CommentItem
                          comment={comment}
                          handleToggleLikeComment={handleToggleLikeComment}
                        />
                      </div>
                    ) : (
                      <InView
                        threshold={1}
                        root={commentSectionRef.current}
                        onChange={(inView) => {
                          if (inView && idx === videoComments.length - 1) {
                            setLoadMore(true);
                          }
                        }}
                        key={comment._id}
                        as="div"
                      >
                        <CommentItem
                          comment={comment}
                          handleToggleLikeComment={handleToggleLikeComment}
                        />
                      </InView>
                    ),
                  )
                )}

                <div style={{ textAlign: 'center' }}>
                  <PulseLoader loading={shouldLoadMore} size={8} />
                </div>
              </div>
              <div className="bottom__comment__container">
                <div className="comment__container">
                  <div className="comment__input">
                    <TextField
                      placeholder={t('ADD_COMMENT_HELPER_TEXT', {
                        ns: 'translation',
                      })}
                      value={commentText}
                      variant="outlined"
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleComment();
                        }
                      }}
                      fullWidth
                    />
                  </div>
                  <div className="comment__post">
                    <Button
                      disabled={commentText === ''}
                      color="secondary"
                      onClick={handleComment}
                    >
                      {t('ADD_COMMENT_BUTTON', { ns: 'translation' })}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="login__required">
              <h4>{t('LOGIN_TO_COMMENT_TITLE', { ns: 'translation' })}</h4>
              <p>{t('LOGIN_TO_COMMENT_DESCRIPTION', { ns: 'translation' })}</p>
              <Button variant="contained" color="secondary">
                {t('LOGIN_BUTTON', { ns: 'auth' })}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

VideoDetail.propTypes = {};

export default VideoDetail;
