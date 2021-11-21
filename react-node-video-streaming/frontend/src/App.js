import React, { useEffect, useRef } from 'react';
import './App.css';
import Streamer from './utils/Streamer';

const App = () => {

    const videoRef = useRef(null);

    useEffect(() => {
      if (videoRef.current) {
        const streamer = new Streamer(videoRef.current);

        videoRef.current.addEventListener('timeupdate', () => {
          setTimeout(() => {
            streamer.fetchNextSegment();
          }, 500)
        });
      }
    }, [videoRef]);

    

    return (
        <div className="App">
            <header className="App-header">
            <video ref={videoRef} controls></video>
            </header>
        </div>
    );
}
export default App;