import path from "node:path";
import debug from "debug";
import ffmpeg, { FfprobeData } from "fluent-ffmpeg";

const videoDebug = debug("video:ffmpeg");

export function getMetadata(file: string) {
  return new Promise<FfprobeData>((resolve, reject) => {
    ffmpeg()
      .input(file)
      .ffprobe((err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
  });
}

export function extractImages(
  file: string,
  startTime: string,
  duration: string,
  output: string
) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(file)
      .addInputOptions(["-ss", startTime])
      .addOutputOptions(["-t", duration, "-vf", "fps=10/1,scale=540:-1"])
      .output(output)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        return reject(err);
      })
      .run();
  });
}

export function resizeVideo(filename: string, originalSize: number) {
  return new Promise<void>((resolve, reject) => {
    const name = path.basename(filename, path.extname(filename));
    const videosFolder = path.dirname(filename);

    const command = ffmpeg()
      .input(filename)
      .addInputOptions([
        "-hwaccel",
        "vaapi",
        "-hwaccel_output_format",
        "vaapi",
        "-hwaccel_device",
        "/dev/dri/renderD128",
      ]);

    if (originalSize >= 360) {
      command
        .output(`${videosFolder}/${name}_360.mp4`)
        .addOutputOptions([
          "-vf",
          "fps=30/1,scale_vaapi=-1:360",
          "-c:v",
          "h264_vaapi",
        ]);
    }

    if (originalSize >= 480) {
      command
        .output(`${videosFolder}/${name}_480.mp4`)
        .addOutputOptions([
          "-vf",
          "fps=30/1,scale_vaapi=-1:480",
          "-c:v",
          "h264_vaapi",
        ]);
    }

    if (originalSize >= 720) {
      command
        .output(`${videosFolder}/${name}_720.mp4`)
        .addOutputOptions([
          "-vf",
          "fps=30/1,scale_vaapi=-1:720",
          "-c:v",
          "h264_vaapi",
        ]);
    }

    if (originalSize >= 1080) {
      command
        .output(`${videosFolder}/${name}_1080.mp4`)
        .addOutputOptions([
          "-vf",
          "fps=30/1,scale_vaapi=-1:1080",
          "-c:v",
          "h264_vaapi",
        ]);
    }

    command
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        return reject(err);
      })
      .on("progress", function (progress) {
        videoDebug(
          "Resizing video: %s %",
          Math.trunc(progress.percent) +
            "." +
            `${progress.percent}`.split(".")[1]?.slice(0, 2)
        );
      })
      .run();
  });
}
