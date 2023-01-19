import ffmpeg from "fluent-ffmpeg";

export function getMetadata(file: string) {
  return new Promise((resolve, reject) => {
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

export async function extractImages(
  file: string,
  startTime: string,
  duration: string,
  output: string
) {
  ffmpeg()
    .input(file)
    .addInputOptions(["-ss", startTime])
    .addOutputOptions(["-t", duration, "-vf", "scale=640:-1"])
    .output(output)
    .run();
}
