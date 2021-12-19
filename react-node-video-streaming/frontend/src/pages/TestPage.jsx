import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import { videoApi } from '../apis';
import ParserMPD from '../services/ParserMPD';
import Streamer from '../services/Streamer';

function TestPage() {
  const videoId = '61bd9403fb337c40f7ddd763';

  const videoRef = useRef();
  const [streamer, setStreamer] = useState(null);

  const initializeStream = async (videoElem) => {
    const manifestDoc = await videoApi.getManifestFile(videoId);
    const parser = new ParserMPD(manifestDoc.data);
    setStreamer(new Streamer(videoElem, parser, videoId));
  };

  useEffect(() => {
    if (videoRef.current) {
      initializeStream(videoRef.current);
    }
  }, [videoRef]);

  const handleStream = async () => {
    streamer.play();
  };

  return (
    <div>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <video ref={videoRef} controls />
      </div>
      <Button onClick={handleStream} variant="contained" color="secondary">
        Start streaming
      </Button>
    </div>
  );
}

export default TestPage;
