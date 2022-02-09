import React, { useEffect, useState, useRef } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import { useLocation } from 'react-router-dom';
import { IconButton, Slider } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import './VideoPlayer.css';
import { API_BASE_URL } from '../../configs';

function VideoPlayer(props) {
  const { showBackButton, handleBack, videoId, autoplay } = props;
  const videoRef = useRef();

  const [volumeValue, setVolumeValue] = useState(100);
  const [oldVolumeValue, setOldVolumeValue] = useState(100);
  const [isPlaying, setPlaying] = useState(autoplay);
  const [isToggleFullScreenMode, setToggleFullScreenMode] = useState(false);
  const [isToggleMute, setToggleMute] = useState(false);

  const location = useLocation();

  const renderVolumeIcon = (curVal) => {
    if (curVal > 50) {
      return <VolumeUpIcon />;
    }
    if (curVal > 0) {
      return <VolumeDownIcon />;
    }
    return <VolumeOffIcon />;
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onplay = () => {
        setPlaying(true);
      };
      videoRef.current.onpause = () => {
        setPlaying(false);
      };
    }
  }, [videoRef]);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volumeValue / 100;
    }
  }, [volumeValue, videoRef]);

  useEffect(() => {
    if (isToggleFullScreenMode) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
      setToggleFullScreenMode(false);
    }
  }, [isToggleFullScreenMode]);

  useEffect(() => {
    if (isToggleMute && videoRef.current) {
      if (videoRef.current.volume > 0) {
        videoRef.current.volume = 0;
        setOldVolumeValue(volumeValue);
        setVolumeValue(0);
      } else {
        videoRef.current.volume = oldVolumeValue / 100;
        setVolumeValue(oldVolumeValue);
      }
      setToggleMute(false);
    }
  }, [isToggleMute, oldVolumeValue, videoRef, volumeValue]);

  return (
    <div className="video__item__container">
      <video
        controls={location.pathname !== '/'}
        name="media"
        className="video__player"
        playsInline
        ref={videoRef}
        autoPlay={autoplay}
      >
        <source src={`${API_BASE_URL}/videos/${videoId}/stream`} />
      </video>

      {location.pathname === '/' && (
        <div className="video__control__wrapper">
          {showBackButton && (
            <div className="back__btn">
              <IconButton onClick={handleBack}>
                <CancelIcon color="action" fontSize="large" />
              </IconButton>
            </div>
          )}

          <div className="video__bottom__control">
            <div className="bottom__control__btn__group">
              <div className="left__btn__group">
                <IconButton
                  className="control__icon"
                  onClick={() => setPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <PauseIcon className="control__icon" />
                  ) : (
                    <PlayArrowIcon className="control__icon" />
                  )}
                </IconButton>

                <div className="volume__area">
                  <IconButton
                    className="control__icon volume__icon"
                    onClick={() => setToggleMute(true)}
                  >
                    {renderVolumeIcon(volumeValue)}
                  </IconButton>

                  <div className="volume__slider">
                    <Slider
                      colormin={0}
                      max={100}
                      onChange={(e, val) => setVolumeValue(val)}
                      defaultValue={100}
                      value={volumeValue}
                    />
                  </div>
                </div>
              </div>
              <div className="right__btn__group">
                <IconButton
                  className="control__icon"
                  onClick={() =>
                    setToggleFullScreenMode(!isToggleFullScreenMode)
                  }
                >
                  <FullScreenIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

VideoPlayer.defaultProps = {
  showBackButton: false,
  autoplay: false,
};

export default VideoPlayer;
