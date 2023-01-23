import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { createReadStream } from "fs-extra";
import { nanoid } from "nanoid";

import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Drive from "@ioc:Adonis/Core/Drive";
import Config from "@ioc:Adonis/Core/Config";
import Route from "@ioc:Adonis/Core/Route";

import Section from "App/Models/Section";
import Video, { VideoStatus } from "App/Models/Video";
import Purchase from "App/Models/Purchase";

import { videoProcessing } from "App/Services/Queue";

export default class VideosController {
  public async index({ params, response }: HttpContextContract) {
    const section = await Section.query()
      .preload("videos", (videos) => videos.orderBy("position"))
      .where("id", params.section)
      .first();

    if (!section) {
      return response.notFound({ error: "Section not found" });
    }

    // TODO check if use has the course

    return section.videos;
  }

  public async store({
    auth: { user },
    params,
    request,
    response,
  }: HttpContextContract) {
    const section = await Section.query()
      .preload("course")
      .where("id", params.section)
      .first();

    if (!section) {
      return response.status(404).send({ message: "Section not found" });
    }

    if (section.course?.ownerId !== user?.username) {
      return response.status(401).send({ message: "Unauthorized" });
    }

    const storeVideoSchema = schema.create({
      name: schema.string([rules.minLength(6), rules.maxLength(100)]),
      description: schema.string.optional([rules.maxLength(5000)]),
    });

    try {
      const payload = await request.validate({ schema: storeVideoSchema });

      // New section with position +1 than last section
      const lastVideo = await Video.query()
        .max("position", "position")
        .where("sectionId", section.id)
        .first();

      const position = lastVideo ? lastVideo.position + 1 : 1;

      const video = new Video();
      video.fill({ ...payload, position, status: VideoStatus.unpublished });
      await video.related("section").associate(section);

      return response.created(video);
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }

  public async show({ params: { id }, response }: HttpContextContract) {
    const video = await Video.find(id);

    if (!video) {
      return response.status(404).send({ error: "Video not found" });
    }

    return video;
  }

  public async update({
    auth: { user },
    params: { id },
    request,
    response,
  }: HttpContextContract) {
    const video = await Video.query()
      .preload("section", (section) => section.preload("course"))
      .where("id", id)
      .first();

    // Check if section exists
    if (!video) {
      return response.notFound({ error: "Video not found" });
    }

    // Check if the authenticated user is the course owner
    if (video.section.course?.ownerId !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    const updateVideoSchema = schema.create({
      name: schema.string([rules.minLength(6), rules.maxLength(100)]),
      description: schema.string.optional([rules.maxLength(5000)]),
    });

    try {
      const payload = await request.validate({ schema: updateVideoSchema });

      await video.merge(payload).save();

      return response.ok(video);
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }

  public async destroy({
    auth: { user },
    params: { id },
    response,
  }: HttpContextContract) {
    const video = await Video.query()
      .preload("section", (section) => section.preload("course"))
      .where("id", id)
      .first();

    // Check if section exists
    if (!video) {
      return response.notFound({ error: "Video not found" });
    }

    // Check if the authenticated user is the course owner
    if (video.section.course?.ownerId !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    // Delete course
    await video.delete();

    return response.noContent();
  }

  public async upload({
    auth: { user },
    params: { id },
    request,
    response,
  }: HttpContextContract) {
    const video = await Video.query()
      .preload("section", (section) => section.preload("course"))
      .where("id", id)
      .first();

    // Check if section exists
    if (!video) {
      return response.notFound({ error: "Video not found" });
    }

    // Check if the authenticated user is the course owner
    if (video.section.course?.ownerId !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    if (video.video) {
      return response.notAcceptable({ error: "The video has been uploaded" });
    }

    // Upload video
    const videoUpload = request.file("video", {
      size: "5gb",
      extnames: ["mp4", "webm", "mkv", "avi", "gif"],
    });

    if (videoUpload?.isValid) {
      const filename = `${nanoid()}.${videoUpload.extname}`;

      await videoUpload.moveToDisk("./", {
        name: filename,
      });

      video.video = filename;

      await videoProcessing.add({ id: video.id, file: videoUpload.filePath });
      video.status = VideoStatus.processing;

      await video.save();

      return response.noContent();
    }

    return response.unsupportedMediaType({ error: "Unsupported Media" });
  }

  public async updateOrder({
    auth: { user },
    params: { id },
    request,
    response,
  }: HttpContextContract) {
    const video = await Video.query()
      .preload("section", (section) => section.preload("course"))
      .where("id", id)
      .first();

    // Check if video exists
    if (!video) {
      return response.notFound({ error: "Video not found" });
    }

    // Check if the authenticated user is the course owner
    if (video.section.course?.ownerId !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    const updateOrderSchema = schema.create({
      videoBefore: schema.string.nullable([
        rules.minLength(21),
        rules.maxLength(21),
      ]),
    });

    try {
      const payload = await request.validate({
        schema: updateOrderSchema,
      });

      // Check if video before exists
      if (payload.videoBefore) {
        const videoBefore = await Video.query()
          .preload("section", (section) => section.preload("course"))
          .where("id", payload.videoBefore)
          .first();

        if (!videoBefore) {
          return response.notFound({ error: "Video before not found" });
        }

        // Check if video before is same course
        if (video.section.courseId !== videoBefore.section.courseId) {
          return response.unprocessableEntity({
            error: "Video do not belong to them same course",
          });
        }

        // Logic to reorder when videoBefore same section
        if (video.section.id !== videoBefore.section.id) {
          video.sectionId = videoBefore.sectionId;
        }

        // Logic to reorder when videoBefore section
        await Video.query()
          .where("sectionId", video.sectionId)
          .where("position", "<", video.position)
          .andWhere("position", ">", videoBefore.position)
          .increment("position", 1);

        video.position = videoBefore.position + 1;
      } else {
        // Logic to reorder when not itemBefore
        await Video.query()
          .where("sectionId", video.sectionId)
          .whereNot("id", video.id)
          .increment("position", 1);

        video.position = 1;
      }

      await video.save();

      return response.ok(video);
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }

  public async watch({
    auth: { user },
    params: { id },
    request,
    response,
  }: HttpContextContract) {
    const video = await Video.find(id);

    if (!video) {
      return response.status(404).send({ error: "Video not found" });
    }

    // Handle stream when valid signature
    if (request.hasValidSignature()) {
      const { range } = request.headers();

      if (!range) {
        return response.badRequest({ error: "Requires Range header" });
      }

      const location = `${video.video}`;

      const { size } = await Drive.getStats(location);

      const CHUNK_SIZE = 10 ** 6; // 1MB

      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, size - 1);
      const contentLength = end - start + 1;

      response.header("Content-Range", `bytes ${start}-${end}/${size}`);
      response.header("Accept-Ranges", "bytes");
      response.header("Content-Length", contentLength);
      response.header("Content-Type", "video/mp4");

      return response
        .status(206)
        .stream(
          createReadStream(
            `${Config.get("drive.disks.local.root")}/${location}`,
            { start, end }
          )
        );
    }

    // Generate signed url
    await video.load("section");
    const purchase = Purchase.query()
      .where("user_id", user?.username!)
      .where("course_id", video.section.courseId);

    if (!purchase) {
      await video.section.load("course");

      if (video.section.course.ownerId !== user?.username) {
        return response.unauthorized({ error: "Unauthorized" });
      }
    }

    const url = await Route.makeSignedUrl(
      "videos.watch",
      { id: video.id },
      { expiresIn: "30m" }
    );

    return response.ok({ url });
  }
}
