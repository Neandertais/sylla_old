import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

import { SectionFactory } from "Database/factories";

test.group("Sections show", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return section object when section exists", async ({
    client,
  }) => {
    const section = await SectionFactory.create();

    const response = await client.get(`api/v1/sections/${section.id}`);

    response.assertStatus(200);
    response.assertBodyContains(section.$attributes);
  });

  test("should return not found when section not exists", async ({
    client,
  }) => {
    const response = await client.get("api/v1/sections/any");

    response.assertStatus(404);
    response.assertBody({ error: "Section not found" });
  });
});
