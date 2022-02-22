import { Typography } from '@material-ui/core';
import React, { useState, useCallback, useRef } from 'react';

import { InView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import FeedItem from '../FeedItem/FeedItem';
import './VideoFeed.css';

function VideoFeed({ type, videos, onEndReached }) {
  const [curVideoIndex, setCurVideoIndex] = useState(-1);
  const user = useSelector((state) => state.auth.user);

  console.log('videos: ', videos);

  const feedRef = useRef();

  const handleRenderVideoElement = useCallback(
    (inView, entry, index) => {
      if (inView) {
        console.log('index: ', index, 'entry: ', entry);
      }
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
    <div className="video__feed__container" ref={feedRef}>
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
              root={null}
              threshold={0.7}
              onChange={(inView, entry) =>
                handleRenderVideoElement(inView, entry, index)
              }
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
