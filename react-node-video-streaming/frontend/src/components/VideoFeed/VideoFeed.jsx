import { Typography } from '@material-ui/core';
import React, { useState, useCallback } from 'react';

import { InView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import FeedItem from '../FeedItem/FeedItem';
import './VideoFeed.css';

function VideoFeed({ type, videos, onEndReached }) {
  const [curVideoIndex, setCurVideoIndex] = useState(-1);
  const user = useSelector((state) => state.auth.user);

  const handleRenderVideoElement = useCallback(
    (inView, index) => {
      if (inView && index !== curVideoIndex) {
        setCurVideoIndex(index);
      }
      if (inView && index === videos.length - 1) {
        onEndReached();
      }
    },
    [curVideoIndex],
  );

  return (
    <div className="video__feed__container">
      <div className="video__feed">
        {!user && type !== 'suggestion' ? (
          <div className="text__center">
            <Typography>
              No video found. Please login to see following accounts&apos;
              videos
            </Typography>
          </div>
        ) : (
          videos.map((video, index) => (
            <InView
              key={video._id}
              threshold={0.8}
              onChange={(inView) => handleRenderVideoElement(inView, index)}
            >
              <div className="video__feed__item">
                <FeedItem
                  video={video}
                  shouldRenderVideo={curVideoIndex === index}
                />
              </div>
            </InView>
          ))
        )}
      </div>
    </div>
  );
}

export default VideoFeed;
