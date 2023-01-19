import Queue from "bull";
import { config } from "../config.js";

export const videoQueue = new Queue("video-processing", {
  redis: config.redis,
});
