import { resolve } from "node:path";
import { videoQueue } from "./services/bull.js";
import { getMetadata, resizeVideo } from "./services/ffmpeg.js";
import { checkSexualContent } from "./services/nsfw.js";

videoQueue.process(5, async (job, done) => {
  const file: string = job.data.file;
  
  const hasSexualContent = await checkSexualContent(file);

  if (hasSexualContent) {
    return done(new Error("Video has sexual content"));
  }

  const metadata = await getMetadata(file);

  await resizeVideo(file, metadata.streams[0].height!);
});

// const input = resolve("./tmp/porn.mp4");

// videoQueue.add({ file: input });