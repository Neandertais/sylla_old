import { resolve } from "path";
import { describe, it, expect } from "vitest";

import { checkSexualContent } from "../src/services/nsfw";

describe("NSFW tests", () => {
  it("should return true if video contains sexual content", async () => {
    const video = resolve("./tests/porn.mp4");

    const result = await checkSexualContent(video);

    expect(result).toBeTruthy();
  });

  it("should return false if video not contains sexual content", async () => {
    const video = resolve("./tests/video.mp4");

    const result = await checkSexualContent(video);

    expect(result).toBeFalsy();
  });
});
