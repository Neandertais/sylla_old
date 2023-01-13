import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { CourseFactory, SectionFactory, UserFactory } from "Database/factories";

test.group("Sections store", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return unauthorized when not logged", async ({ client }) => {
    const response = await client.post("api/v1/courses/any/sections");

    response.assertStatus(401);
  });

  test("should return not found when course not exists", async ({ client }) => {
    const user = await UserFactory.create();

    const response = await client
      .post("api/v1/courses/any/sections")
      .loginAs(user);

    response.assertStatus(404);
    response.assertBody({ error: "Course not found" });
  });

  test("should return unauthorized when logged in user is not the course owner", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const course = await CourseFactory.with("owner").create();
    const section = await SectionFactory.make();

    const response = await client
      .post(`api/v1/courses/${course.id}/sections`)
      .json(section)
      .loginAs(user);

    response.assertStatus(401);
    response.assertBody({ error: "Unauthorized" });
  });

  test("should return section object when submitted valid properties", async ({
    client,
  }) => {
    const course = await CourseFactory.with("owner").create();
    const section = await SectionFactory.make();

    const response = await client
      .post(`api/v1/courses/${course.id}/sections`)
      .json({ name: section.name })
      .loginAs(course.owner);

    response.assertStatus(201);
    response.assertBodyContains({ name: section.name });
  });

  test("should return section object with position 3", async ({ client }) => {
    const course = await CourseFactory.with("owner").create();
    await SectionFactory.merge([
      { position: 1, courseId: course.id },
      { position: 2, courseId: course.id },
    ]).createMany(2);
    const section = await SectionFactory.make();

    const response = await client
      .post(`api/v1/courses/${course.id}/sections`)
      .json({ name: section.name })
      .loginAs(course.owner);

    response.assertStatus(201);
    response.assertBodyContains({ name: section.name, position: 3 });
  });

  test("should return error status when name submitted is invalid", async ({
    client,
  }) => {
    const course = await CourseFactory.with("owner").create();

    const response = await client
      .post(`api/v1/courses/${course.id}/sections`)
      .json({ name: "A" })
      .loginAs(course.owner);

    response.assertStatus(400);
  });
});
