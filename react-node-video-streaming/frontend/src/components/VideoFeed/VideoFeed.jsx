import React, { useEffect, useState, useCallback } from 'react';

import { InView } from 'react-intersection-observer';
import FeedItem from '../FeedItem/FeedItem';
import './VideoFeed.css';

function VideoFeed({ videos }) {
  const [curVideoIndex, setCurVideoIndex] = useState(-1);

  const handleRenderVideoElement = useCallback(
    (inView, index) => {
      if (inView && index !== curVideoIndex) {
        setCurVideoIndex(index);
      }
    },
    [curVideoIndex],
  );

  return (
    <div className="video__feed__container">
      <div className="video__feed">
        {videos.map((video, index) => (
          <InView
            threshold={0.8}
            onChange={(inView) => handleRenderVideoElement(inView, index)}
          >
            <div className="video__feed__item">
              <FeedItem
                key={video._id}
                video={video}
                shouldRenderVideo={curVideoIndex === index}
              />
            </div>
          </InView>
        ))}
      </div>
    </div>
  );
}

export default VideoFeed;
