import { videoQueue } from "./services/bull.js";
import { checkSexualContent } from "./services/nsfw.js";
import { getMetadata, resizeVideo } from "./services/ffmpeg.js";

videoQueue.process(5, async (job, done) => {
  try {
    const file: string = job.data.file;

    const hasSexualContent = await checkSexualContent(file);
    if (hasSexualContent) {
      done(new Error("Video has sexual content"));
      return;
    }

    job.progress(50);

    const metadata = await getMetadata(file);

    await resizeVideo(file, metadata.streams[0].height!);

    done();
  } catch (error) {
    done(new Error("Processing failure"));
  }
});
