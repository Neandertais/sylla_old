import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { CourseFactory, UserFactory } from "Database/factories";

test.group("Courses destroy", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return unauthorized when not logged", async ({ client }) => {
    const response = await client.delete("api/v1/courses/any");

    response.assertStatus(401);
  });

  test("should return not found when course not exists", async ({ client }) => {
    const user = await UserFactory.create();

    const response = await client.delete("api/v1/courses/any").loginAs(user);

    response.assertStatus(404);
    response.assertBody({ error: "Course not found" });
  });

  test("should return unauthorized when logged in user is not the course owner", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const course = await CourseFactory.create();

    const response = await client
      .delete(`api/v1/courses/${course.id}`)
      .loginAs(user);

    response.assertStatus(401);
    response.assertBody({ error: "Unauthorized" });
  });

  test("should return no content status when course deleted", async ({
    client,
  }) => {
    const course = await CourseFactory.with("owner").create();

    const response = await client
      .delete(`api/v1/courses/${course.id}`)
      .loginAs(course.owner);

    response.assertStatus(204);
  });
});
