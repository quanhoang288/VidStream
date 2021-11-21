export default class Streamer {
    constructor(videoElm) {
      this.mediaSource = new MediaSource();
      this.videoElm = videoElm;
      this.lastByteRequested = -1;
      this.chunkSize=500000;
      this.finished = false;
      this.curChunkIdx = -1;
  
      this.initVideoElementSource();
      this.registerMediaSourceEvents();
  
  
    }
  
  
    initVideoElementSource = () => {
      this.videoElm.src = URL.createObjectURL(this.mediaSource);
    }
  
    registerMediaSourceEvents = () => {
      this.mediaSource.addEventListener('sourceopen', this.sourceOpen, { once: true });
    }
  
    sourceOpen = () => {
      URL.revokeObjectURL(this.videoElm.src);
      const sourceBuffer = this.mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
  
      const { fromByte, toByte } = this.getRequestRange();
  
      // Fetch beginning of the video by setting the Range HTTP request header.
      fetch('http://localhost:8000/video', { headers: { range: `bytes=${fromByte}-${toByte}` } })
      .then(response => response.arrayBuffer())
      .then(data => {
        sourceBuffer.appendBuffer(data);
        this.curChunkIdx += 1;
        this.updateLastByteReceived();
        sourceBuffer.addEventListener('updateend', this.updateEnd, { once: true });
      });
    }
  
    updateEnd = () => {
      // Fetch the next segment of video when user starts playing the video.
      this.videoElm.addEventListener('playing', this.fetchNextSegment, { once: true });
    }
  
    fetchNextSegment = () => {
      if (this.finished) {
        return;
      }
      const { fromByte, toByte } = this.getRequestRange();
  
      fetch('http://localhost:8000/video', { headers: { range: `bytes=${fromByte}-${toByte}` } })
      .then(response => {
        if (this.isLastChunk(response)) {
          this.finished = true;
        }
        return response.arrayBuffer();
      })
      .then(data => {
        const sourceBuffer = this.mediaSource.sourceBuffers[0];
        sourceBuffer.appendBuffer(data);
        this.curChunkIdx += 1;
        this.updateLastByteReceived();
        if (this.finished) {
          this.mediaSource.endOfStream();
        }
      })
      .catch(err => console.log(err));
    }
  
    getRequestRange = () => {
      return {
        fromByte: this.lastByteRequested + 1,
        toByte: this.lastByteRequested + this.chunkSize
      };
    }
  
    updateLastByteReceived = () => {
      this.lastByteRequested += this.chunkSize; 
    }
  
    isLastChunk = (res) => {
      const contentRange = res.headers.get('Content-Range')
      const byteRange = contentRange.split(' ')[1];
      const parts = byteRange.split('/');
      const lastChunkByte = parts[0].split('-')[1];
      const fileSize = parts[1];
      return lastChunkByte + 1 === fileSize;
    }
  }