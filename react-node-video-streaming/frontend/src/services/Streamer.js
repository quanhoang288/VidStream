import getRepresentationMimeString from '../utils/getRepresentationMimeString';
import { videoApi } from '../apis';
import selectRepresentations from '../utils/selectRepresentations';

export default class Streamer {
  constructor(videoElm, parser, videoId) {
    this.videoElm = videoElm;
    this.videoId = videoId;
    this.parser = parser;

    this.stream = {
      media: {
        streamTypes: [],
        representations: selectRepresentations(parser),
        lastRepresentationsIds: {},
        lastRepresentationSwitch: 0,
        duration: this.parser.duration,
      },
      buffer: {
        throttled: false,
        throttleTimeout: null,
        healthyDuration: this.parser.minBufferTime,
        mediaSource: null,
        sourceBuffers: {
          audio: null,
          video: null,
        },
      },
      downlink: {
        value: null,
        entries: [],
      },
    };

    this.stream.media.streamTypes = Object.keys(
      this.stream.media.representations,
    );

    /**
     * Measure real downlink speeds.
     */
    document.body.addEventListener('downlink', (e) => {
      const downlinkInBits = e.detail;
      const sample = {
        size: 7,
        discardSlowest: 1, // Smooth out random dips in download speeds.
        discardFastest: 2, // Small chunks can lead to higher download speeds reported.
      };

      this.stream.downlink.entries.unshift(downlinkInBits);
      this.stream.downlink.entries = this.stream.downlink.entries.slice(
        0,
        sample.size,
      );

      // Make sure we have large enough sample size to draw any conclusions.
      if (this.stream.downlink.entries.length === sample.size) {
        /**
         * Sort and remove extremes.
         */
        const entriesSortedAsc = [...this.stream.downlink.entries].sort(
          (a, b) => a - b,
        );
        const entriesWithoutExtremes = entriesSortedAsc.slice(
          sample.discardSlowest,
          sample.size - sample.discardFastest,
        );

        /**
         * Rolling average of last entries without the extremes.
         */
        this.stream.downlink.value =
          entriesWithoutExtremes.reduce(
            (a, b) => a + b,
            entriesWithoutExtremes[0],
          ) / entriesWithoutExtremes.length;
      }
    });

    this.initializeStream();
  }

  async initializeStream() {
    await this.initializeMediaSource();

    this.initializeBuffers();

    this.observeVideoUpdates();
  }

  initializeMediaSource() {
    const mediaSource = new MediaSource();
    this.videoElm.src = URL.createObjectURL(mediaSource);

    return new Promise((resolve) => {
      mediaSource.addEventListener('sourceopen', (e) => {
        if (!this.stream.buffer.mediaSource) {
          this.stream.buffer.mediaSource = e.target;
          this.stream.buffer.mediaSource.duration = this.stream.media.duration;
        }
        resolve();
      });
    });
  }

  initializeBuffers() {
    const { streamTypes, representations } = this.stream.media;

    streamTypes.forEach((streamType) => {
      const mimeString = getRepresentationMimeString(
        representations[streamType][0],
      );
      this.stream.buffer.sourceBuffers[streamType] =
        this.initializeBuffers(mimeString);
    });

    this.bufferAhead();
  }

  observeVideoUpdates() {
    this.videoElm.addEventListener('timeupdate', () => {
      if (!this.stream.buffer.throttled) this.bufferAhead();
    });

    this.videoElm.addEventListener('seek', () => {
      this.unthrottleBuffer();
      this.bufferAhead();
    });
  }

  getDownlink() {
    let navigationDownlink;
    if (navigator.connection) {
      navigationDownlink = navigator.connection.downlink;
    }
    return this.stream.downlink.value || navigationDownlink || 10;
  }

  getRepresentationsByBandwidth() {
    const representations = {
      audio: this.stream.media.representations.audio[0] || null,
      video: null,
    };

    const lastSwitchedBefore =
      Date.now() - this.stream.media.lastRepresentationSwitch;
    const lockRepresentationFor = 5000;

    if (lastSwitchedBefore < lockRepresentationFor) {
      const lastVideoRepId = this.stream.media.lastRepresentationsIds.video;
      representations.video = this.stream.media.representations.video.find(
        (videoObj) => videoObj.id === lastVideoRepId,
      );
      return representations;
    }

    const downlinkInBits = this.getDownlink() * 1000000;
    let usedBandwidth = 0;

    if (representations.audio) {
      usedBandwidth += parseInt(representations.audio.bandwidth || 200000, 10);
    }

    representations.video = this.stream.media.representations.video.reduce(
      (previous, current) => {
        const currentBandwidth = parseInt(current.bandwidth, 10);
        const previousBandwidth = parseInt(previous.bandwidth, 10);

        const currentIsHigherQuality = currentBandwidth > previousBandwidth;
        const currentFitsDownlink =
          currentBandwidth + usedBandwidth <= downlinkInBits;
        const previousDoesntFitDownlink =
          previousBandwidth + usedBandwidth > downlinkInBits;
        const currentIsLessData = currentBandwidth < previousBandwidth;

        if (currentIsHigherQuality && currentFitsDownlink) return current;
        if (previousDoesntFitDownlink && currentIsLessData) return current;
        return previous;
      },
      this.stream.media.representations.video[0],
    );

    return representations;
  }

  throttleBuffer() {
    this.stream.buffer.throttled = true;
    this.stream.buffer.throttleTimeout = setTimeout(() => {
      this.stream.buffer.throttled = false;
    }, 1000);
  }

  unthrottleBuffer() {
    this.stream.buffer.throttled = false;
    if (this.stream.buffer.throttleTimeout) {
      clearTimeout(this.stream.buffer.throttleTimeout);
      this.stream.buffer.throttleTimeout = null;
    }
    return this.media;
  }

  initializeSourceBuffer(mimeString) {
    const sourceBuffer =
      this.stream.buffer.mediaSource.addSourceBuffer(mimeString);

    sourceBuffer.dataQueue = {
      internal: {
        entries: [],
        updating: false,
      },

      append(data) {
        this.internal.entries.push(data);
        if (!this.internal.updating) {
          this.step();
        }
      },

      step() {
        const data = this.internel.entries.shift();
        if (data) {
          this.internal.updating = true;
          sourceBuffer.appendBuffer(data);
        }
      },
    };

    sourceBuffer.fileQueue = {
      internal: {
        files: [],
        bufferedFiles: new Set(),
        reading: false,
      },

      add(fileObj) {
        if (!fileObj.force && this.internal.bufferedFiles.has(fileObj.id))
          return;

        this.internal.files.push(fileObj.fileName);
        this.internal.bufferedFiles.add(fileObj.id);

        if (!this.internal.reading) this.step();
      },

      step() {
        const fileName = this.internal.files.shift();
        if (!fileName) return;

        this.internal.reading = true;
        const startTime = performance.now();

        videoApi.getChunk(this.videoId, fileName).then(async (res) => {
          const chunkData = res.data;
          const chunkSize = res.headers.ContentType;

          const minSizeForDownlinkMeasurement = 10000;

          if (chunkSize >= minSizeForDownlinkMeasurement) {
            const elapsedInSeconds = (performance.now() - startTime) / 1000;
            const downlinkInBits = Math.round(
              (chunkSize / elapsedInSeconds) * 8,
            );
            const downlinkInMBits = downlinkInBits / 1000000;
            const downlinkEvent = new CustomEvent('downlink', {
              detail: downlinkInMBits,
            });
            document.body.dispatchEvent(downlinkEvent);
          }
          sourceBuffer.enqueueAppendBuffer(chunkData);

          this.internal.reading = false;
          this.step();
        });

        // videoApi.getChunk(this.videoId, fileName).then(async (res) => {
        //   const reader = res.getReader();
        //   const readChunk = async () => {
        //     const { value, done } = await reader.read();
        //     return [value, done];
        //   };

        //   let data;
        //   let done;

        //   do {
        //     const startTime = performance.now();

        //     [data, done] = await readChunk();

        //     const minSizeForDownlinkMeasurement = 10000;
        //     if (data && data.length >= minSizeForDownlinkMeasurement) {
        //       const elapsedInSecons = (performance.now() - startTime) / 1000;
        //       const downlinkInBits = Math.round(
        //         (data.length / elapsedInSecons) * 8,
        //       );
        //       const downlinkInMBits = downlinkInBits / 1000000;
        //       const downlinkEvent = new CustomEvent('downlink', {
        //         detail: downlinkInMBits,
        //       });
        //       document.body.dispatchEvent(downlinkEvent);
        //     }

        //     if (!done) {
        //       sourceBuffer.enqueueAppendBuffer(data);
        //     }
        //   } while (!done);

        //   this.internal.reading = false;
        //   this.step();
        // });
      },
    };

    sourceBuffer.addEventListener('updateend', (e) => {
      e.target.dataQueue.internal.updating = false;
      e.target.dataQueue.step();
    });

    sourceBuffer.enqueueAppendBuffer = sourceBuffer.dataQueue.append.bind(
      sourceBuffer.dataQueue,
    );
    sourceBuffer.enqueueFile = sourceBuffer.fileQueue.add.bind(
      sourceBuffer.fileQueue,
    );

    return sourceBuffer;
  }

  getBufferHealth(buffer) {
    const currentPlaybackTime = this.videoElm.currentTime;
    const { healthyDuration } = this.stream.buffer;
    const bufferedTimeRanges = buffer.buffered;

    let bufferLeft = 0;
    let bufferEndTime = currentPlaybackTime;

    for (let i = 0; i < bufferedTimeRanges.length; i += 1) {
      const start = bufferedTimeRanges.start(i);
      const end = bufferedTimeRanges.end(i);

      if (currentPlaybackTime >= start && currentPlaybackTime <= end) {
        bufferLeft = end - currentPlaybackTime;
        bufferEndTime = end;
      }
    }

    return {
      isHealthy: bufferLeft >= healthyDuration,
      bufferEndTime,
    };
  }

  bufferAhead() {
    this.throttleBuffer();

    const currentRepresentations = this.getRepresentationsByBandwidth();
    const { streamTypes, lastRepresentationsIds } = this.stream.media;

    streamTypes.forEach((streamType) => {
      const buffer = this.stream.buffer.sourceBuffers[streamType];
      const bufferHealth = this.getBufferHealth(this);
      if (!bufferHealth.isHealthy) {
        const representation = currentRepresentations[streamType];
        const chunkIndex = representation.getSegmentIndexByTime(
          bufferHealth.bufferEndTime,
        );

        if (chunkIndex) {
          const lastRepresentationId = lastRepresentationsIds[streamType];
          const filesToBuffer = [];

          if (representation.id !== lastRepresentationId) {
            this.stream.media.lastRepresentationSwitch = Date.now();
            filesToBuffer.push({
              id: `initial-${representation.id}`,
              fileName: representation.getInitialSegment(),
              force: true,
            });
          }

          this.stream.media.lastRepresentationsIds[streamType] =
            representation.id;

          const chunkIndicesToLoad = [chunkIndex];
          if (chunkIndex < representation.maxChunkIndex) {
            chunkIndicesToLoad.push(chunkIndex + 1);
          }

          chunkIndicesToLoad.forEach((index) => {
            filesToBuffer.push({
              id: index,
              fileName: representation.getSegmentByIndex(index),
            });
          });

          filesToBuffer.map((fileObj) => buffer.enqueueFile(fileObj));
        }
      }
    });
  }
}
