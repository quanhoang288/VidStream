import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import { videoApi } from '../apis';

function TestPage() {
  const videoId = '61b74bf8754ee420e8a4fbd8';
  const firstChunkName = 'chunk-stream0-00001.m4s';
  const secondChunkName = 'chunk-stream0-00002.m4s';
  const videoRef = useRef();
  const mediaSource = new MediaSource();
  const [sourceBuffer, setSourceBuffer] = useState(null);
  const [isBufferMore, setBufferMore] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener(
        'sourceopen',
        () => {
          URL.revokeObjectURL(videoRef.current.src);
          const buffer = mediaSource.addSourceBuffer(
            'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
          );
          setSourceBuffer(buffer);
        },
        { once: true },
      );
    }
  }, [videoRef]);

  useEffect(() => {
    const updateEnd = () => {
      console.log('fetching first chunk finished!');
    };
    if (sourceBuffer) {
      sourceBuffer.addEventListener('updateend', updateEnd, {
        once: true,
      });

      sourceBuffer.addEventListener('error', () => console.log('error'));
    }
  }, [sourceBuffer]);

  useEffect(() => {
    if (isBufferMore) {
      videoApi.getChunk(videoId, secondChunkName).then((res) => {
        const chunkData = res.data;
        sourceBuffer.appendBuffer(chunkData);
        setBufferMore(false);
      });
    }
  }, [isBufferMore]);

  const handleFetchManifestFile = async () => {
    const manifestFile = await videoApi.getManifestFile(videoId);
    const parser = new DOMParser();
    const manifestDoc = parser.parseFromString(manifestFile.data, 'text/xml');
    console.log(manifestDoc);
  };

  const handleFetchVideoChunk = async () => {
    console.log('fetching chunk...');
    const res = await videoApi.getChunk(videoId, firstChunkName);
    const chunkData = await res.data;
    console.log(res.headers);
    sourceBuffer.appendBuffer(chunkData);
  };

  return (
    <div>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <video ref={videoRef} controls />
      </div>
      <Button onClick={handleFetchManifestFile}>Download manifest file</Button>
      <Button onClick={handleFetchVideoChunk}>
        Download first video chunk
      </Button>
    </div>
  );
}

export default TestPage;
