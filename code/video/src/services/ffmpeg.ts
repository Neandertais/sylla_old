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
      .addOutputOptions(["-t", duration, "-vf", "scale=540:-1"])
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
