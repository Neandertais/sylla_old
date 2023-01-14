import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { SectionFactory, UserFactory, VideoFactory } from "Database/factories";

test.group("Videos store", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return not found if section does not exist", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const video = await VideoFactory.make();

    const response = await client
      .post("api/v1/sections/any/videos")
      .json(video)
      .loginAs(user);

    response.assertStatus(404);
  });

  test("should return unauthorized if the logged in user not the course owner", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const section = await SectionFactory.create();
    const video = await VideoFactory.make();

    const response = await client
      .post(`api/v1/sections/${section.id}/videos`)
      .json(video)
      .loginAs(user);

    response.assertStatus(401);
  });

  test("should return list videos objects", async ({ client }) => {
    const user = await UserFactory.create();
    const section = await SectionFactory.with("course", 1, (course) =>
      course.merge({ ownerId: user.username })
    ).create();
    const video = await VideoFactory.make();

    const response = await client
      .post(`api/v1/sections/${section.id}/videos`)
      .json(video)
      .loginAs(user);

    response.assertStatus(201);
  });
});
