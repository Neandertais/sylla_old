import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { SectionFactory, UserFactory } from "Database/factories";

test.group("Section destroy", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return unauthorized when not logged", async ({ client }) => {
    const response = await client.delete("api/v1/sections/any");

    response.assertStatus(401);
  });

  test("should return not found when section not exists", async ({
    client,
  }) => {
    const user = await UserFactory.create();

    const response = await client.delete("api/v1/sections/any").loginAs(user);

    response.assertStatus(404);
    response.assertBody({ error: "Section not found" });
  });

  test("should return unauthorized when logged in user is not the course owner", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const section = await SectionFactory.with("course", 1, (course) =>
      course.with("owner")
    ).create();

    const response = await client
      .delete(`api/v1/sections/${section.id}`)
      .loginAs(user);

    response.assertStatus(401);
    response.assertBody({ error: "Unauthorized" });
  });

  test("should return no content status when section deleted", async ({
    client,
  }) => {
    const section = await SectionFactory.with("course", 1, (course) =>
      course.with("owner")
    ).create();

    const response = await client
      .delete(`api/v1/sections/${section.id}`)
      .loginAs(section.course.owner);

    response.assertStatus(204);
  });
});
