import Database from "@ioc:Adonis/Lucid/Database";
import Drive from "@ioc:Adonis/Core/Drive";
import { file } from "@ioc:Adonis/Core/Helpers";
import { test } from "@japa/runner";
import { CourseFactory, UserFactory } from "Database/factories";

test.group("Courses store", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return unauthorized when not logged", async ({ client }) => {
    const response = await client.post("api/v1/courses");

    response.assertStatus(401);
  });

  test("should return course object when submitted valid properties", async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create();
    const course = await CourseFactory.make();
    const thumbnail = await file.generateJpg("1mb");

    const fakeDrive = Drive.fake();

    const response = await client
      .post("api/v1/courses")
      .file("thumbnail", thumbnail.contents, { filename: thumbnail.name })
      .fields(course.$attributes)
      .loginAs(user);

    assert.isTrue(await fakeDrive.exists(thumbnail.name));

    fakeDrive.restore("local");

    response.assertStatus(201);
  });

  test("should return error status when submitted invalid properties", async ({
    client,
  }) => {
    const user = await UserFactory.create();

    const response = await client
      .post("api/v1/courses")
      .json({
        name: "A",
        shortDescription: "B",
        description: "C",
        willLearn: "D",
        price: "C",
      })
      .loginAs(user);

    response.assertStatus(400);
  });

  test("should return error status when not submitted required properties", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const course = await CourseFactory.make();

    const response = await client
      .post("api/v1/courses")
      .json({
        description: course.description,
        willLearn: course.willLearn,
        price: course.price,
      })
      .loginAs(user);

    response.assertStatus(400);
  });
});
