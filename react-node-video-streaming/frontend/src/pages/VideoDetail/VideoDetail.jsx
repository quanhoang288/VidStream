import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import FavoriteIcon from '@material-ui/icons/Favorite';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import { Button, IconButton, TextField } from '@material-ui/core';
// import CancelIcon from '@material-ui/icons/Cancel';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import './VideoDetail.css';

import { videoApi } from '../../apis';
import { ASSET_BASE_URL } from '../../configs';

function CommentItem({ comment }) {
  return (
    <div className="comment__item">
      <a href="#" className="comment__item__avatar">
        <img
          src={`${ASSET_BASE_URL}/${comment.user.avatar.fileName}`}
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

  const [videoInfo, setVideoInfo] = useState({});
  // const [videoComments, setVideoComments] = useState([]);

  const params = useParams();

  const testComments = [
    {
      user: {
        username: 'quan hoang',
        avatar: {
          fileName: 'file_example_MP4_1920_18MG-1640930119158-thumbnail.png',
        },
      },
      content: 'Test comment',
      createdAt: '2h',
    },
    {
      user: {
        username: 'quan hoang',
        avatar: {
          fileName: 'file_example_MP4_1920_18MG-1640930119158-thumbnail.png',
        },
      },
      content: 'Test comment',
      createdAt: '2h',
    },
    {
      user: {
        username: 'quan hoang',
        avatar: {
          fileName: 'file_example_MP4_1920_18MG-1640930119158-thumbnail.png',
        },
      },
      content: 'Test comment',
      createdAt: '2h',
    },
    {
      user: {
        username: 'quan hoang',
        avatar: {
          fileName: 'file_example_MP4_1920_18MG-1640930119158-thumbnail.png',
        },
      },
      content: 'Test comment',
      createdAt: '2h',
    },
    {
      user: {
        username: 'quan hoang',
        avatar: {
          fileName: 'file_example_MP4_1920_18MG-1640930119158-thumbnail.png',
        },
      },
      content: 'Test comment',
      createdAt: '2h',
    },
  ];

  const onBack = () => {
    console.log('go back');
  };

  const fetchVideoInfo = async (id) => {
    try {
      const fetchResult = await videoApi.getInfo(id);
      console.log('info: ', fetchResult.data);
      setVideoInfo(fetchResult.data.video);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVideoComments = async (id) => {
    try {
      const fetchResult = await videoApi.getComments(id);
      console.log(fetchResult.data);
      // setVideoComments(fetchResult.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
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

            <Button variant="outlined">Follow</Button>
          </div>
          <div className="video__item__description">
            <span>{videoInfo.description}</span>
          </div>
          <div className="like__comment__button__group">
            <div>
              <IconButton>
                <FavoriteIcon />
              </IconButton>
              <strong>{videoInfo.likes ? videoInfo.likes.length : null}</strong>
            </div>
            <div>
              <IconButton>
                <InsertCommentIcon />
              </IconButton>
              <strong>{videoInfo.numComments}</strong>
            </div>
          </div>
        </div>

        <div className="comment__section">
          {testComments.map((comment) => (
            <CommentItem comment={comment} />
          ))}
        </div>
        <div className="bottom__comment__container">
          <div className="comment__container">
            <div className="comment__input">
              <TextField
                placeholder="Thêm bình luận"
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="comment__post">
              <Button disabled>Đăng</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

VideoDetail.propTypes = {};

export default VideoDetail;
