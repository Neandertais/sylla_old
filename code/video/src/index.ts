import * as tf from "@tensorflow/tfjs-node";
import nsfw from "nsfwjs";
import fs from "fs";
import { resolve } from "path";

import { extractImages, getMetadata } from "./services/ffmpeg.js";

// Extract 1s of video in images
// ffmpeg -ss 00:00:00 -i tmp/porn.mp4 -t 1 -vf scale=640:-1 tmp/images/%04d.bmp

// ffmpeg()
//   .input(input)
//   .addInputOptions(["-ss", "00:00:00"])
//   .addOutputOptions(["-t", "1", "-vf", "scale=640:-1"])
//   .output(output);

// const { duration } = await getMetadata(input);
// await extractImages(input, "621", "1", output)

// Get duration
// Repeat ->>
// Gen images for frames
// Analyze images
// Exclude images

tf.enableProdMode();

const input = resolve("./tmp/porn.mp4");
const outputDir = resolve("./tmp/images");
const output = resolve("./tmp/images/%04d.bmp");

const { duration } = await getMetadata(input);

const model = await nsfw.load();

for (let i = 0, currentFrame = 0; i < duration!; i = i + 2) {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputDir);

  console.log(i);
  

  await extractImages(input, i.toString(), "2", output);

  const files = fs.readdirSync(resolve("./tmp/images"));

  for (const file of files) {
    const content = fs.readFileSync(resolve(`./tmp/images/${file}`));
    const image = tf.node.decodeBmp(content);
    const predications = await model.classify(image);
    image.dispose();

    currentFrame++;

    console.log({ currentFrame, predications });
  }
}
