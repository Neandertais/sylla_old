import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Section from "App/Models/Section";
import Video from "App/Models/Video";
import { nanoid } from "nanoid";

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

      const video = new Video();
      video.fill(payload);
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
}
