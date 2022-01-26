import React, { useState, useEffect } from 'react';
import Main from '../../containers/Main/Main';
import Sidebar from '../../components/Sidebar/Sidebar';
import VideoFeed from '../../components/VideoFeed/VideoFeed';
import './Home.css';

import { videoApi } from '../../apis';

function Home() {
  const [videos, setVideos] = useState([]);

  const fetchSuggestedList = async () => {
    try {
      const result = await videoApi.getSuggestedList();
      setVideos(result.data.suggestedList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSuggestedList();
  }, []);

  useEffect(() => {
    console.log('videos: ', videos);
  }, [videos]);

  return (
    <Main>
      <div className="home__container">
        <Sidebar />
        <VideoFeed videos={videos} />
      </div>
    </Main>
  );
}

export default Home;
