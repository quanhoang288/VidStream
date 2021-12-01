const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { ASSET_DIR } = require('../configs');

const ffmpegServices = {};

ffmpegServices.encode = (file) =>
  new Promise((resolve, reject) => {
    const sizes = [
      [240, 350],
      [480, 700],
      [720, 2500],
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
    ffmpegCmd
      .format('dash')
      .videoCodec('libx264')
      .audioCodec('aac')
      .audioChannels(2)
      .audioFrequency(44100)
      .outputOptions([
        '-preset veryfast',
        '-keyint_min 60',
        '-g 60',
        '-sc_threshold 0',
        '-profile:v main',
        '-use_template 1',
        '-use_timeline 1',
        '-b_strategy 0',
        '-bf 1',
        '-map 0:a?',
        '-b:a 96k',
      ]);

    for (let i = 0; i < sizes.length; i += 1) {
      const size = sizes[i];
      ffmpegCmd.outputOptions([
        `-filter_complex [0]format=pix_fmts=yuv420p[temp${i}];[temp${i}]scale=-2:${size[0]}[A${i}]`,
        `-map [A${i}]:v`,
        `-b:v:${i} ${size[1]}k`,
      ]);
    }

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
        console.log('error', err.message);
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
