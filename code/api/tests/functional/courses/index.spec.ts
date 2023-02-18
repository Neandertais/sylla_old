import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

import { CourseFactory } from "Database/factories";

test.group("Courses index", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return list courses objects", async ({ client }) => {
    await CourseFactory.createMany(5);

    const response = await client.get("api/v1/courses");

    response.assertStatus(200);
  });
});
