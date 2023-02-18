import Drive from "@ioc:Adonis/Core/Drive";
import { file } from "@ioc:Adonis/Core/Helpers";
import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

import { CourseFactory, UserFactory } from "Database/factories";

test.group("Courses update", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return unauthorized when not logged", async ({ client }) => {
    const response = await client.patch("api/v1/courses/any");

    response.assertStatus(401);
  });

  test("should return not found when course not exists", async ({ client }) => {
    const user = await UserFactory.create();

    const response = await client.patch("api/v1/courses/any").loginAs(user);

    response.assertStatus(404);
    response.assertBody({ error: "Course not found" });
  });

  test("should return unauthorized when logged in user is not the course owner", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const course = await CourseFactory.create();

    const response = await client
      .patch(`api/v1/courses/${course.id}`)
      .loginAs(user);

    response.assertStatus(401);
    response.assertBody({ error: "Unauthorized" });
  });

  test("should return course object when updated properties", async ({
    client,
    assert,
  }) => {
    const course = await CourseFactory.with("owner").create();
    const newCourse = await CourseFactory.make();
    const thumbnail = await file.generateJpg("1mb");

    const fakeDrive = Drive.fake();

    const response = await client
      .put(`api/v1/courses/${course.id}`)
      .file("thumbnail", thumbnail.contents, { filename: thumbnail.name })
      .fields(newCourse.$attributes)
      .loginAs(course.owner);

    assert.isTrue(await fakeDrive.exists(thumbnail.name));

    fakeDrive.restore("local");

    response.assertStatus(200);
    response.assertBodyContains({
      name: newCourse.name,
      shortDescription: newCourse.shortDescription,
      description: newCourse.description,
      willLearn: newCourse.willLearn,
      price: newCourse.price,
    });
  });

  test("should return error status when submitted invalid properties", async ({
    client,
  }) => {
    const course = await CourseFactory.with("owner").create();

    const response = await client
      .patch(`api/v1/courses/${course.id}`)
      .json({
        name: "A",
        shortDescription: "B",
        description: "C",
        willLearn: "D",
        price: "C",
      })
      .loginAs(course.owner);

    response.assertStatus(400);
  });
});
