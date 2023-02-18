import Drive from "@ioc:Adonis/Core/Drive";
import { file } from "@ioc:Adonis/Core/Helpers";
import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

import { VideoFactory, UserFactory } from "Database/factories";

test.group("Videos update", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return unauthorized when not logged", async ({ client }) => {
    const response = await client.post("api/v1/videos/any/upload");

    response.assertStatus(401);
  });

  test("should return not found when video not exists", async ({ client }) => {
    const user = await UserFactory.create();

    const response = await client
      .post("api/v1/videos/any/upload")
      .loginAs(user);

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

    const response = await client
      .post(`api/v1/videos/${video.id}/upload`)
      .loginAs(user);

    response.assertStatus(401);
    response.assertBody({ error: "Unauthorized" });
  });

  test("should return no content when upload successful", async ({
    client,
    assert,
  }) => {
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();
    const videoFile = await file.generateGif("1mb");

    const fakeDrive = Drive.fake();

    const response = await client
      .post(`api/v1/videos/${video.id}/upload`)
      .file("video", videoFile.contents, { filename: videoFile.name })
      .loginAs(video.section.course.owner);

    assert.isTrue(await fakeDrive.exists(videoFile.name));

    fakeDrive.restore("local");

    response.assertStatus(204);
  });

  test("should return unauthorized media", async ({ client }) => {
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();
    const videoFile = await file.generatePng("1mb");

    const response = await client
      .post(`api/v1/videos/${video.id}/upload`)
      .file("video", videoFile.contents, { filename: videoFile.name })
      .loginAs(video.section.course.owner);

    response.assertStatus(415);
    response.assertBody({ error: "Unsupported Media" });
  });
});
