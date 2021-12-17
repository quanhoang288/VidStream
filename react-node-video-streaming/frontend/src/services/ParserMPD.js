import iso8601TimeDurationToSeconds from '../utils/Duration';

const getChunkURLFromTemplate = (
  chunkUrl,
  representationObject,
  chunkIndex = 0,
) => {
  chunkIndex = chunkIndex.toString();
  const replaceTuples = [
    [/\$RepresentationID\$/, representationObject.id],
    [
      /\$Number%([0-9]+)d\$/,
      (_, repeats) => chunkIndex.padStart(parseInt(repeats, 10), 0),
    ],
  ];

  replaceTuples.forEach(([from, to]) => {
    chunkUrl = chunkUrl.replace(from, to);
  });
  return chunkUrl;
};

const getSegmentByIndex = (representationObject, index) => {
  const segmentTemplate =
    representationObject.element.querySelector('SegmentTemplate');
  const chunkUrlTemplate = segmentTemplate.getAttribute('media');

  return getChunkURLFromTemplate(chunkUrlTemplate, representationObject, index);
};

const getInitialSegment = (representationObject) => {
  const segmentTemplate =
    representationObject.element.querySelector('SegmentTemplate');
  const chunkURLTemplate = segmentTemplate.getAttribute('initialization');

  return getChunkURLFromTemplate(chunkURLTemplate, representationObject);
};

const getSegmentIndexByTime = (representationObject, time) => {
  const segmentTemplate =
    representationObject.element.querySelector('SegmentTemplate');
  const segmentTimeline = segmentTemplate.querySelector('SegmentTimeline');
  const segmentElements = [...segmentTimeline.querySelectorAll('S')];
  const timescale = Number(segmentTemplate.getAttribute('timescale'));

  if (!timescale) return null;

  const requestedTimeInTimescale = time * timescale;

  let currentStart = 0;
  let currentEnd = 0;
  let currentIndex = 0;
  let returnIndex = 0;

  segmentElements.forEach((elm) => {
    const duration = Number(elm.getAttribute('d'));
    const repeats = Number(elm.getAttribute('r') || 0) + 1;

    currentStart = Number(elm.getAttribute('t')) || currentStart;
    currentEnd = currentStart + duration * repeats;

    if (
      requestedTimeInTimescale >= currentStart &&
      requestedTimeInTimescale <= currentEnd
    ) {
      const timeIntoSegment = requestedTimeInTimescale - currentStart;
      returnIndex = currentIndex + Math.floor(timeIntoSegment / duration);
    }

    currentIndex += repeats;
    currentStart = currentEnd;
  });

  return returnIndex;
};

const representationElementToObject = (repElem) => {
  const representation = [...repElem.attributes].reduce((carry, attr) => {
    carry[attr.name] = attr.value;
    return carry;
  }, {});
  representation.element = repElem;
  representation.maxChunkIndex = [...repElem.querySelectorAll('S')].reduce(
    (chunkIndex, segmentElem) =>
      chunkIndex + 1 + Number(segmentElem.getAttribute('r') || 0),
    0,
  );
  representation.getInitialSegment = getInitialSegment.bind(
    null,
    representation,
  );
  representation.getSegmentByIndex = getSegmentByIndex.bind(
    null,
    representation,
  );
  representation.getSegmentIndexByTime = getSegmentIndexByTime.bind(
    null,
    representation,
  );
};

export default class ParserMPD {
  constructor(manifest) {
    const domParser = new DOMParser();

    this.internal = {};
    this.internal.manifest = domParser.parseFromString(manifest, 'text/xml');
    this.internal.bandwidth = 10 * 1000 * 1000;

    this.internal.root = this.internal.manifest.querySelector('MPD');
    if (!this.internal.root) {
      throw new Error('[ParserMPD] Invalid manifest document');
    }
    if (this.internal.root.querySelectorAll('Period').length > 1) {
      throw new Error(
        '[ParserMPD] Manifests containing more than one <Period> are not yet supported',
      );
    }

    // Public properties.
    this.minBufferTime = this.getMinBufferTime();
    this.duration = this.getDuration();
  }
  // listAllChunks() {
  //   const repObjects = [
  //     ...this.internal.root.querySelectorAll('Representation'),
  //   ].map(representationElementToObject);

  // }

  /**
   * Returns the minimum healthy buffer duration.
   *
   * @returns {number} Healthy buffer duration.
   */
  getMinBufferTime() {
    const minBufferTimeDuration =
      this.internal.root.getAttribute('minBufferTime');
    const minBufferTimeSeconds = iso8601TimeDurationToSeconds(
      minBufferTimeDuration,
    );

    return minBufferTimeSeconds || 3;
  }

  /**
   * Returns the duration of the whole media in seconds.
   *
   * @returns {number} Media duration.
   */
  getDuration() {
    const duration = this.internal.root.getAttribute(
      'mediaPresentationDuration',
    );
    const durationInSeconds = iso8601TimeDurationToSeconds(duration);

    return durationInSeconds;
  }

  queryRepresentation(repQuery, contentType, lang = null) {
    let adaptationSetQuery = `AdaptationSet[contentType="${contentType}"]`;
    if (lang) adaptationSetQuery += `[lang="${lang}"]`;

    const adaptationSet = this.internal.root.querySelector(adaptationSetQuery);
    if (!adaptationSet) return [];

    const repElements = [
      ...adaptationSet.querySelectorAll(`Representation${repQuery}`),
    ];
    const repObjects = repElements.map(representationElementToObject);
    return repObjects;
  }
}
