const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { ASSET_DIR } = require('../configs');

const ffmpegServices = {};

ffmpegServices.encode = (file) =>
  new Promise((resolve, reject) => {
    const sizes = [
      [640, 450],
      [854, 1000],
      [1280, 1500],
      // [360, 450],
      // [480, 1000],
      // [720, 1500],
    ];
    const basename = path.basename(file.filename, path.extname(file.filename));
    const sourceFn = file.path;
    const targetDir = file.destination;
    const targetFn = path.join(targetDir, `${basename}.mpd`);

    const startTime = Date.now();

    const ffmpegCmd = ffmpeg({
      source: path.resolve(sourceFn),
      cwd: path.resolve(targetDir),
    });

    ffmpegCmd.outputOptions('-r 30');

    for (let i = 0; i < sizes.length; i += 1) {
      ffmpegCmd.outputOptions(`-map 0:v:0`);
    }

    ffmpegCmd.outputOptions('-map 0:a?:0');

    sizes.forEach((size, index) => {
      ffmpegCmd
        .outputOptions(`-b:v:${index} ${size[1]}k`)
        .outputOptions(`-c:v:${index} libx264`)
        .outputOptions(`-filter:v:${index}`, `scale=${size[0]}:-1`);
    });

    ffmpegCmd
      .outputOptions([
        '-preset veryslow',
        '-use_template 1',
        '-use_timeline 1',
        '-x264opts keyint=60:min-keyint=60:no-scenecut',
        '-seg_duration 4',
      ])
      .outputOptions('-adaptation_sets', 'id=0,streams=v id=1,streams=a')
      .format('dash');

    ffmpegCmd.on('start', (commandLine) => {
      console.log(`Spawned FFmpeg with command: ${commandLine}`);
    });

    ffmpegCmd
      .on('progress', (info) => {
        console.log(`Encoding: ${info.percent}`);
      })
      .on('end', () => {
        const endTime = Date.now();
        console.log(`Encoding finished after ${(endTime - startTime) / 1000}s`);
        resolve({ targetDir, targetFn });
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .save(path.resolve(targetFn));
  });

ffmpegServices.generateThumbnail = (file) =>
  new Promise((resolve, reject) => {
    const basename = path.basename(file.filename, path.extname(file.filename));
    const sourceFn = file.path;
    const targetDir = ASSET_DIR;
    const thumbnailFileName = `${basename}-thumbnail.png`;
    const targetFn = path.join(targetDir, thumbnailFileName);

    const ffmpegCmd = ffmpeg({
      source: path.resolve(sourceFn),
      cwd: path.resolve(targetDir),
    });

    ffmpegCmd.on('start', (commandLine) => {
      console.log('Generating thumbnail');
      console.log(`Spawned FFmpeg with command: ${commandLine}`);
    });

    ffmpegCmd
      .seekInput('00:00:01')
      .outputOptions(['-frames:v 1'])
      .on('end', () =>
        resolve({
          filename: thumbnailFileName,
          path: targetFn,
        }),
      )
      .on('error', (err) => {
        console.log('error', err.message);
        reject(err);
      })
      .save(path.resolve(targetFn));
  });

module.exports = ffmpegServices;
