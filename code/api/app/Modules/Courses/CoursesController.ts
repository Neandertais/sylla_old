import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import Course from "App/Models/Course";
import Purchase from "App/Models/Purchase";
import { nanoid } from "nanoid";

export default class CoursesController {
  public async index({}: HttpContextContract) {
    // TODO: paginate, list by keyword, by owner

    // TODO: order by evaluation
    const courses = Course.query().select("*");

    return courses;
  }

  public async store({
    auth: { user },
    request,
    response,
  }: HttpContextContract) {
    const storeCourseSchema = schema.create({
      name: schema.string([
        rules.trim(),
        rules.minLength(12),
        rules.maxLength(120),
      ]),
      shortDescription: schema.string([
        rules.minLength(20),
        rules.maxLength(560),
      ]),
      description: schema.string.optional([
        rules.minLength(20),
        rules.maxLength(1200),
      ]),
      willLearn: schema.string.optional([
        rules.minLength(20),
        rules.maxLength(840),
      ]),
      price: schema.number.optional(),
    });

    try {
      const payload = await request.validate({ schema: storeCourseSchema });

      // Create curse and associate with user authenticated
      const course = new Course();
      course.fill(payload);
      await course.related("owner").associate(user!);

      // Upload thumbnail image
      const thumbnail = request.file("thumbnail", {
        size: "10mb",
        extnames: ["jpg", "png", "webp"],
      });

      if (thumbnail?.isValid) {
        const filename = `${nanoid()}.${thumbnail.extname}`;

        await thumbnail.moveToDisk("./", {
          name: filename,
        });

        course.merge({ thumbnail: filename });
      }

      await course.save();

      return response.created(course);
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }

  public async show({ params: { id }, response }: HttpContextContract) {
    const course = await Course.find(id);

    if (!course) {
      return response.notFound({ error: "Course not found" });
    }

    return course;
  }

  public async update({
    auth: { user },
    params: { id },
    request,
    response,
  }: HttpContextContract) {
    const course = await Course.find(id);

    // Check if course exists
    if (!course) {
      return response.notFound({ error: "Course not found" });
    }

    // Check if the authenticated user is the course owner
    if (course.ownerId !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    const updateCourseSchema = schema.create({
      name: schema.string.optional([
        rules.trim(),
        rules.minLength(12),
        rules.maxLength(120),
      ]),
      shortDescription: schema.string.optional([
        rules.minLength(20),
        rules.maxLength(560),
      ]),
      description: schema.string.optional([
        rules.minLength(20),
        rules.maxLength(1200),
      ]),
      willLearn: schema.string.optional([
        rules.minLength(20),
        rules.maxLength(840),
      ]),
      price: schema.number.optional(),
    });

    try {
      const payload = await request.validate({ schema: updateCourseSchema });

      // Merge course
      course.merge(payload);

      // Upload thumbnail image
      const thumbnail = request.file("thumbnail", {
        size: "10mb",
        extnames: ["jpg", "png", "webp"],
      });

      if (thumbnail?.isValid) {
        const filename = `${nanoid()}.${thumbnail.extname}`;

        await thumbnail.moveToDisk("./", {
          name: filename,
        });

        // TODO - remove image

        course.merge({ thumbnail: filename });
      }

      await course.save();

      return response.ok(course);
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }

  public async destroy({
    auth: { user },
    params: { id },
    response,
  }: HttpContextContract) {
    const course = await Course.find(id);

    // Check if course exists
    if (!course) {
      return response.status(404).send({ error: "Course not found" });
    }

    // Check if the authenticated user is the course owner
    if (course.ownerId !== user?.username) {
      return response.unauthorized({ error: "Unauthorized" });
    }

    // Delete course
    await course.delete();
    // TODO - remove thumbnail

    return response.noContent();
  }

  public async buy({
    auth: { user },
    params: { id },
    response,
  }: HttpContextContract) {
    const course = await Course.find(id);

    if (!course) {
      return response.notFound({ error: "Course not found " });
    }

    if (course.price > user?.cash!) {
      return response.badRequest({ error: "Insufficient money" });
    }

    const trx = await Database.transaction();

    try {
      user?.useTransaction(trx);

      await user?.merge({ cash: user.cash - course.price }).save();
      const purchase = await Purchase.create({
        user_id: user?.username,
        course_id: course.id,
      });

      await trx.commit();

      return response.created(purchase);
    } catch (error) {
      await trx.rollback();

      return response.internalServerError({ error: "Internal server error" });
    }
  }
}
