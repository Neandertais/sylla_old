import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

import { VideoFactory, UserFactory } from "Database/factories";

test.group("Videos update", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return unauthorized when not logged", async ({ client }) => {
    const response = await client.patch("api/v1/videos/any");

    response.assertStatus(401);
  });

  test("should return not found when video not exists", async ({ client }) => {
    const user = await UserFactory.create();

    const response = await client.patch("api/v1/videos/any").loginAs(user);

    response.assertStatus(404);
    response.assertBody({ error: "Video not found" });
  });

  test("should return unauthorized when logged in user is not the course owner", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();
    const newVideo = await VideoFactory.make();

    const response = await client
      .patch(`api/v1/videos/${video.id}`)
      .json({ name: newVideo.name })
      .loginAs(user);

    response.assertStatus(401);
    response.assertBody({ error: "Unauthorized" });
  });

  test("should return video object when updated properties", async ({
    client,
  }) => {
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();
    const newVideo = await VideoFactory.make();

    const response = await client
      .patch(`api/v1/videos/${video.id}`)
      .json({ name: newVideo.name })
      .loginAs(video.section.course.owner);

    response.assertStatus(200);
    response.assertBodyContains({ name: newVideo.name });
  });

  test("should return error status when name submitted is invalid", async ({
    client,
  }) => {
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();

    const response = await client
      .patch(`api/v1/videos/${video.id}`)
      .json({ name: "A" })
      .loginAs(video.section.course.owner);

    response.assertStatus(400);
  });
});
