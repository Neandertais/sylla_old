import Queue from "bull";
import Config from "@ioc:Adonis/Core/Config";
import Video, { VideoStatus } from "App/Models/Video";

const config = Config.get("redis.connections.local");

export const videoProcessing = new Queue("video-processing", {
  redis: {
    port: config.port,
    host: config.host,
    password: config.password,
  },
});

videoProcessing.on("global:completed", async (jobID) => {
  const job = await videoProcessing.getJob(jobID);
  const video = await Video.find(job!.data.id);

  video!.status = VideoStatus.published;
  await video?.save();
});

videoProcessing.on("global:failed", async (jobID, err) => {
  const job = await videoProcessing.getJob(jobID);
  const video = await Video.find(job!.data.id);

  if (err.message === "Video has sexual content") {
    video!.status = VideoStatus["error:has sexual content"];
  }

  video!.status = VideoStatus["error:internal error"];
  await video?.save();
});
