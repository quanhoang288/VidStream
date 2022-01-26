import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import FavoriteIcon from '@material-ui/icons/Favorite';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import { Button, IconButton, TextField } from '@material-ui/core';
// import CancelIcon from '@material-ui/icons/Cancel';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import './VideoDetail.css';

import { userApi, videoApi, videoCommentApi, videoLikeApi } from '../../apis';
import { ASSET_BASE_URL } from '../../configs';
import { showModal } from '../../redux/actions/modalActions';
import AuthHandler from '../../containers/AuthHandler/AuthHandler';

function CommentItem({ comment }) {
  return (
    <div className="comment__item">
      <a href="#" className="comment__item__avatar">
        <img
          src={
            comment.user.avatar
              ? `${ASSET_BASE_URL}/${comment.user.avatar.fileName}`
              : null
          }
          alt="Profile"
          width={50}
        />
      </a>

      <div className="comment__item__content">
        <a href="#" className="comment__item__username">
          <span>{comment.user.username}</span>
        </a>
        <p className="comment__text__content">{comment.content}</p>
        <div className="comment__item__timestamp">{comment.createdAt}</div>
      </div>

      <div className="comment__item__like">
        <IconButton>
          <FavoriteIcon />
        </IconButton>
        <span>100</span>
      </div>
    </div>
  );
}

function VideoDetail() {
  const [videoId, setVideoId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [videoInfo, setVideoInfo] = useState({});
  const [videoComments, setVideoComments] = useState([]);
  const [isFollowingAuthor, setFollowingAuthor] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const params = useParams();

  const onBack = () => {
    console.log('go back');
  };

  const fetchVideoInfo = async (id) => {
    try {
      const fetchResult = await videoApi.getInfo(id);
      setVideoInfo(fetchResult.data.video);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVideoComments = async (id) => {
    try {
      const fetchResult = await videoApi.getComments(id);
      setVideoComments(fetchResult.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleFollow = useCallback(async () => {
    if (!user) {
      dispatch(showModal());
      return;
    }
    console.log('video author: ', videoInfo.uploadedBy._id);
    if (isFollowingAuthor) {
      await userApi.unfollow(videoInfo.uploadedBy._id, user.token);
    } else {
      await userApi.follow(videoInfo.uploadedBy._id, user.token);
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
      const createdComment = result.data.comment;
      console.log(createdComment);
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
    } catch (error) {
      console.log(error);
    }
  }, [commentText, videoId, user]);

  const checkFollowing = useCallback(async () => {
    try {
      const result = await userApi.getFollowingList(user.id, user.token);
      const { followingList } = result.data;
      setFollowingAuthor(
        followingList.findIndex((u) => u._id === videoInfo.uploadedBy._id) !==
          -1,
      );
    } catch (error) {
      console.log(error);
    }
  }, [user, videoInfo]);

  useEffect(() => {
    if (params && params.videoId) {
      setVideoId(params.videoId);
    }
  }, [params]);

  useEffect(() => {
    if (videoId) {
      fetchVideoInfo(videoId);
      fetchVideoComments(videoId);
    }
  }, [videoId]);

  useEffect(() => {
    if (user && videoInfo) {
      checkFollowing();
    }
  }, [user, videoInfo]);

  return (
    <>
      <AuthHandler />
      <div className="video__detail__container">
        <div className="video__player__container">
          <VideoPlayer
            showBackButton={true}
            handleBack={onBack}
            videoId={videoId}
          />
        </div>
        <div className="video__meta__info">
          <div className="info__container">
            <div className="video__author__info">
              <a href="#" className="comment__item__avatar">
                <img
                  src="https://img.hoidap247.com/picture/answer/20200402/large_1585798495452.jpg"
                  alt="Profile"
                  width={50}
                />
              </a>
              <a href="#" className="author__name">
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
                  {isFollowingAuthor ? 'Following' : 'Follow'}
                </Button>
              )}
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
              <div className="comment__section">
                {videoComments.map((comment) => (
                  <CommentItem key={comment._id} comment={comment} />
                ))}
              </div>
              <div className="bottom__comment__container">
                <div className="comment__container">
                  <div className="comment__input">
                    <TextField
                      placeholder="Thêm bình luận"
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
                      Đăng
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="login__required">
              <h4>Log in to see comments</h4>
              <p>Log in to see comments and like the video.</p>
              <Button variant="contained" color="secondary">
                Log in
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
