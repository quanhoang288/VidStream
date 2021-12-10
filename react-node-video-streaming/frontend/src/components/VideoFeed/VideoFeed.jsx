import React from 'react';
import FeedItem from '../FeedItem/FeedItem';
import './VideoFeed.css';

function VideoFeed() {
  return (
    <div className="video__feed__container">
      <div className="video__feed">
        <FeedItem />
        <FeedItem />
        <FeedItem />
        <FeedItem />
        <FeedItem />
      </div>
    </div>
  );
}

export default VideoFeed;
