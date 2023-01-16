import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { CourseFactory, UserFactory } from "Database/factories";

test.group("Courses buy", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return purchase object when successful", async ({ client }) => {
    // When creating a user you get 50 money
    const user = await UserFactory.create();
    const course = await CourseFactory.merge({ price: 50 }).create();

    const response = await client
      .post(`api/v1/courses/${course.id}/buy`)
      .loginAs(user);

    response.assertStatus(201);
    response.assertBodyContains({
      user_id: user.username,
      course_id: course.id,
    });
  });

  test("should return error when user does not have enough money", async ({
    client,
  }) => {
    // When creating a user you get 50 money
    const user = await UserFactory.create();
    const course = await CourseFactory.merge({ price: 100 }).create();

    const response = await client
      .post(`api/v1/courses/${course.id}/buy`)
      .loginAs(user);

    response.assertStatus(400);
    response.assertBody({ error: "Insufficient money" });
  });
});
