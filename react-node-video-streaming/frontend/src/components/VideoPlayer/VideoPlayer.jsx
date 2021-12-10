import React, { useState } from 'react';

import {
  Button,
  IconButton,
  Popover,
  Slider,
  Typography,
} from '@material-ui/core';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import './VideoPlayer.css';

function VideoPlayer() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'playbackrate-popover' : undefined;

  return (
    <div className="video__item__container">
      <video autoPlay muted loop name="media" className="video__player">
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
      </video>
      <div className="video__control__wrapper">
        <div className="video__bottom__control">
          <div className="video__progress__bar">
            <Slider color="secondary" />
          </div>
          <div className="bottom__control__btn__group">
            <div className="left__btn__group">
              <IconButton className="control__icon">
                <PlayArrowIcon fontSize="large" className="control__icon" />
              </IconButton>

              <div className="volume__area">
                <IconButton className="control__icon volume__icon">
                  <VolumeUpIcon fontSize="large" />
                </IconButton>

                <div className="volume__slider">
                  <Slider
                    color="#fff"
                    colormin={0}
                    max={100}
                    defaultValue={100}
                  />
                </div>
              </div>

              <Typography className="timetrack">05:05</Typography>
            </div>
            <div className="right__btn__group">
              <Button
                onClick={handlePopover}
                variant="text"
                className="control__icon"
              >
                <Typography>1X</Typography>
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
              >
                <div className="playback__rate">
                  {[0.5, 1, 1.5, 2].map((rate) => (
                    <Button variant="text">
                      <Typography>{rate}</Typography>
                    </Button>
                  ))}
                </div>
              </Popover>
              <IconButton className="control__icon">
                <FullScreenIcon fontSize="large" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
