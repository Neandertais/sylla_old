import ffmpeg from "fluent-ffmpeg";

export function getMetadata(file: string) {
  return new Promise<ffmpeg.FfprobeFormat>((resolve, reject) => {
    ffmpeg()
      .input(file)
      .ffprobe((err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data.format);
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

export function resizeVideo(file: string, outDir: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(file)
      .addInputOptions([
        "-hwaccel",
        "vaapi",
        "-hwaccel_output_format",
        "vaapi",
        "-hwaccel_device",
        "/dev/dri/renderD128",
      ])
      .output(outDir + "/output_360.mp4")
      .addOutputOptions([
        "-vf",
        "hwupload,fps=30/1,scale_vaapi=-1:360",
        "-c:v",
        "h264_vaapi",
      ])
      .output(outDir + "/output_480.mp4")
      .addOutputOptions([
        "-vf",
        "hwupload,fps=30/1,scale_vaapi=-1:480",
        "-c:v",
        "h264_vaapi",
      ])
      .output(outDir + "/output_720.mp4")
      .addOutputOptions([
        "-vf",
        "hwupload,fps=30/1,scale_vaapi=-1:720",
        "-c:v",
        "h264_vaapi",
      ])
      .on("start", function (commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        return reject(err);
      })
      .on("progress", function (progress) {
        console.log("Processing: " + progress.percent + "% done");
      })
      .run();
  });
}
