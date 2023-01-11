import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { CourseFactory } from "Database/factories";

test.group("Courses show", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return course object when user exists", async ({ client }) => {
    const course = await CourseFactory.create();

    const response = await client.get(`api/v1/courses/${course.id}`);

    response.assertStatus(200);
    response.assertBodyContains({
      name: course.name,
      shortDescription: course.shortDescription,
      description: course.description,
      willLearn: course.willLearn,
      price: course.price,
    });
  });

  test("should return not found when course not exists", async ({ client }) => {
    const response = await client.get("api/v1/courses/any");

    response.assertStatus(404);
    response.assertBody({ error: "Course not found" });
  });
});
