import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { readdir, rm, mkdir } from "node:fs/promises";

import {
  getMetadata,
  extractImages,
  resizeVideo,
} from "../src/services/ffmpeg";

describe("FFmpeg tests", () => {
  it("should return metadata of video", async () => {
    const video = resolve("./tests/video.mp4");

    const metadata = await getMetadata(video);

    expect(metadata.format.size).toBe(1261034);
    expect(metadata.format.format_name).toBe("mov,mp4,m4a,3gp,3g2,mj2");
  });

  it("should extract 10 images every frame", async () => {
    const video = resolve("./tests/video.mp4");
    const output = resolve(`./tests/${randomUUID()}`);

    await mkdir(output, { recursive: true });

    await extractImages(video, "1", "1", output + "/%04d.bmp");

    const files = await readdir(output);
    await rm(output, { recursive: true, force: true });

    expect(files.length).toBe(10);
  });

  it("should resize video", async () => {
    const video = resolve("./tests/video.mp4");

    const metadata = await getMetadata(video);

    await resizeVideo(video, metadata.streams[0].height!);

    const files = await readdir(resolve("./tests"));
    await rm(resolve("./tests/video_360.mp4"));

    expect(files).toEqual(expect.arrayContaining(["video_360.mp4"]));
  });
});
