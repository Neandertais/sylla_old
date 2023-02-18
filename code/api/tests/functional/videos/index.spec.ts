import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

import { SectionFactory, UserFactory } from "Database/factories";

test.group("Videos index", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return list videos objects", async ({ client }) => {
    const user = await UserFactory.create();
    const section = await SectionFactory.with("videos", 5).create();

    const response = await client
      .get(`api/v1/sections/${section.id}/videos`)
      .loginAs(user);

    response.assertStatus(200);
  });
});
