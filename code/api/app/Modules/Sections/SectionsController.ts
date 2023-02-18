import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

import Course from "App/Models/Course";
import Section from "App/Models/Section";

export default class SectionsController {
  public async index({ params: { course }, response }: HttpContextContract) {
    // Check if course exists
    if (!(await Course.find(course))) {
      return response.notFound({ error: "Course not found" });
    }

    // Query sections with course ordered by position
    const sections = await Section.query()
      .where("courseId", course)
      .orderBy("position");

    return response.ok(sections);
  }

  public async store({
    auth: { user },
    params,
    request,
    response,
  }: HttpContextContract) {
    const course = await Course.find(params.course);

    // Check if course exists
    if (!course) {
      return response.notFound({ error: "Course not found" });
    }

    // Check if the authenticated user is the course owner
    if (course.ownerId !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    const storeSectionSchema = schema.create({
      name: schema.string([rules.minLength(6), rules.maxLength(80)]),
    });

    try {
      const payload = await request.validate({ schema: storeSectionSchema });

      // New section with position +1 than last section
      const lastSection = await Section.query()
        .max("position", "position")
        .where("courseId", course.id)
        .first();

      const position = lastSection ? lastSection.position + 1 : 1;

      // Create section and associante with course
      const section = new Section();
      section.fill({ ...payload, position });
      await section.related("course").associate(course);

      await section.save();

      return response.created(section);
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }

  public async show({ params: { id }, response }: HttpContextContract) {
    const section = await Section.find(id);

    if (!section) {
      return response.notFound({ error: "Section not found" });
    }

    return response.ok(section);
  }

  public async update({
    auth: { user },
    params: { id },
    request,
    response,
  }: HttpContextContract) {
    const section = await Section.query()
      .preload("course")
      .where("id", id)
      .first();

    // Check if section exists
    if (!section) {
      return response.notFound({ error: "Section not found" });
    }

    // Check if the authenticated user is the course owner
    if (section.course?.ownerId !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    const updateSectionSchema = schema.create({
      name: schema.string([rules.minLength(6), rules.maxLength(80)]),
    });

    try {
      const payload = await request.validate({ schema: updateSectionSchema });

      await section.merge(payload).save();

      return response.ok(section);
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }

  public async destroy({
    auth: { user },
    params: { id },
    response,
  }: HttpContextContract) {
    const section = await Section.query()
      .preload("course")
      .where("id", id)
      .first();

    // Check if section exists
    if (!section) {
      return response.status(404).send({ error: "Section not found" });
    }

    // Check if the authenticated user is the course owner
    if (section.course.ownerId !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    // Delete course
    await section.delete();

    return response.noContent();
  }

  public async updateOrder({
    auth: { user },
    params: { id },
    request,
    response,
  }: HttpContextContract) {
    const section = await Section.query()
      .preload("course")
      .where("id", id)
      .first();

    // Check if section exists
    if (!section) {
      return response.notFound({ error: "Section not found" });
    }

    // Check if the authenticated user is the course owner
    if (section.course?.ownerId !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    const updateOrderSchema = schema.create({
      sectionBefore: schema.string.nullable([
        rules.minLength(21),
        rules.maxLength(21),
      ]),
    });

    try {
      const payload = await request.validate({
        schema: updateOrderSchema,
      });

      // Check if section before exists
      if (payload.sectionBefore) {
        const sectionBefore = await Section.find(payload.sectionBefore);

        if (!sectionBefore) {
          return response.notFound({ error: "Section before not found" });
        }

        // Check if section before is same course
        if (section.courseId !== sectionBefore.courseId) {
          return response.unprocessableEntity({
            error: "Sections do not belong to them same course",
          });
        }

        // Logic to reorder when itemBefore
        await Section.query()
          .where("position", "<", section.position)
          .andWhere("position", ">", sectionBefore.position)
          .increment("position", 1);

        section.position = sectionBefore.position! + 1;
      } else {
        // Logic to reorder when not itemBefore
        await Section.query()
          .where("courseId", section.courseId)
          .whereNot("id", section.id)
          .increment("position", 1);

        section.position = 1;
      }

      await section.save();

      return response.ok(section);
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }
}
