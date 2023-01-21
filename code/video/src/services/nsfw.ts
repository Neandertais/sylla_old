import fs from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";

import * as tf from "@tensorflow/tfjs-node";
import * as nsfw from "nsfwjs";
import debug from "debug";

import { extractImages, getMetadata } from "./ffmpeg.js";

tf.enableProdMode();
const model = await nsfw.load();

const videoDebugger = debug("video:content");

export async function checkSexualContent(video: string) {
  const temporaryDir = resolve(`./tmp/${randomUUID()}`);
  const output = resolve(temporaryDir + "/%04d.bmp");

  const {
    format: { duration },
  } = await getMetadata(video);

  for (let time = 0; time < duration!; time = time + 10) {
    if (fs.existsSync(temporaryDir)) {
      fs.rmSync(temporaryDir, { recursive: true, force: true });
    }
    fs.mkdirSync(temporaryDir, { recursive: true });

    await extractImages(video, time.toString(), "10", output);

    const files = fs.readdirSync(temporaryDir);

    let currentFrame = 0;

    for (const file of files) {
      const content = fs.readFileSync(resolve(temporaryDir + "/" + file));
      const image = tf.node.decodeBmp(content);
      const predications = await model.classify(image);
      image.dispose();

      currentFrame++;

      videoDebugger(
        "Time: %d, Current Frame: %d, Predications: %O",
        time,
        currentFrame,
        predications
      );

      const probabilities: number[] = [];

      predications.forEach(({ className, probability }) => {
        const sexClass = ["Porn", "Sexy", "Hentai"];
        if (sexClass.includes(className)) {
          probabilities.push(probability);
        }
      });

      if (probabilities.find((value) => value > 0.85)) {
        fs.rmSync(temporaryDir, { recursive: true, force: true });

        return true;
      }
    }
  }
  fs.rmSync(temporaryDir, { recursive: true, force: true });

  return false;
}
