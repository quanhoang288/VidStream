import React, { useEffect, useState, useRef } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';

import {
  Button,
  IconButton,
  Popover,
  Slider,
  Typography,
} from '@material-ui/core';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

import FullScreenIcon from '@material-ui/icons/Fullscreen';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import './VideoPlayer.css';
import { API_BASE_URL } from '../../configs';

function VideoPlayer(props) {
  const { showBackButton, handleBack, videoId } = props;
  const videoRef = useRef();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'playbackrate-popover' : undefined;

  const [isPlaying, setPlaying] = useState(false);

  const handlePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="video__item__container">
      <video name="media" className="video__player" ref={videoRef}>
        <source src={`${API_BASE_URL}/videos/${videoId}/stream`} />
      </video>

      <div className="video__control__wrapper">
        {showBackButton && (
          <div className="back__btn">
            <IconButton onClick={handleBack}>
              <CancelIcon color="action" fontSize="large" />
            </IconButton>
          </div>
        )}

        <div className="video__bottom__control">
          <div className="video__progress__bar">
            <Slider color="secondary" />
          </div>
          <div className="bottom__control__btn__group">
            <div className="left__btn__group">
              <IconButton
                className="control__icon"
                onClick={() => setPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <PauseIcon fontSize="medium" className="control__icon" />
                ) : (
                  <PlayArrowIcon fontSize="medium" className="control__icon" />
                )}
              </IconButton>

              <div className="volume__area">
                <IconButton className="control__icon volume__icon">
                  <VolumeUpIcon fontSize="medium" />
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
                <FullScreenIcon fontSize="medium" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

VideoPlayer.defaultProps = {
  showBackButton: false,
};

export default VideoPlayer;
