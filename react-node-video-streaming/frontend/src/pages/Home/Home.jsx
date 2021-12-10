import React from 'react';
import Main from '../../containers/Main/Main';
import Sidebar from '../../components/Sidebar/Sidebar';
import VideoFeed from '../../components/VideoFeed/VideoFeed';
import './Home.css';

function Home() {
  return (
    <Main>
      <div className="home__container">
        <Sidebar />
        <VideoFeed />
      </div>
    </Main>
  );
}

export default Home;
