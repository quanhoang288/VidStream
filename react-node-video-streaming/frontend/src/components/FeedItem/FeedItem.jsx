import React from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import { Divider, IconButton, Typography } from '@material-ui/core';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './FeedItem.css';

function FeedItem() {
  return (
    <div className="video__feed__item">
      <div className="feed__item__content">
        <div className="author__info">
          <a href="#" className="author__profile">
            <img
              src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/e2f494ed12dcf61969fe99f2e59d183a.jpeg?x-expires=1639198800&x-signature=ULqM0Co73tKsfp45FwHQLNToFDA%3D"
              alt="Profile"
            />
          </a>
          <a href="#" className="author__name">
            <h3>Hoang Huy Quan</h3>
          </a>
        </div>
        <div className="feed__caption">
          <strong>Big game tmr</strong>
        </div>
        <div className="video__action__bar">
          <VideoPlayer />
          <div className="action__bar">
            <div className="text__center like__wrapper">
              <IconButton>
                <FavoriteIcon />
              </IconButton>
              <Typography>171.5K</Typography>
            </div>
            <div className="text__center comment__wrapper">
              <IconButton>
                <InsertCommentIcon />
              </IconButton>
              <Typography>1868</Typography>
            </div>
          </div>
        </div>
      </div>
      <Divider />
    </div>
  );
}

export default FeedItem;
