import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

import { VideoFactory, UserFactory } from "Database/factories";

test.group("Videos update order", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return unauthorized when not logged", async ({ client }) => {
    const response = await client.post("api/v1/videos/any/reorder");

    response.assertStatus(401);
  });

  test("should return not found when video not exists", async ({ client }) => {
    const user = await UserFactory.create();

    const response = await client
      .post("api/v1/videos/any/reorder")
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
      .post(`api/v1/videos/${video.id}/reorder`)
      .json({ videoBefore: null })
      .loginAs(user);

    response.assertStatus(401);
    response.assertBody({ error: "Unauthorized" });
  });

  test("should return not found when videoBefore not exists", async ({
    client,
  }) => {
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();

    const response = await client
      .post(`api/v1/videos/${video.id}/reorder`)
      .json({ videoBefore: "123456712345671234567" })
      .loginAs(video.section.course.owner);

    response.assertStatus(404);
    response.assertBody({ error: "Video before not found" });
  });

  test("should return unprocessable when videos are from courses are different", async ({
    client,
  }) => {
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();
    const videoBefore = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();

    const response = await client
      .post(`api/v1/videos/${video.id}/reorder`)
      .json({ videoBefore: videoBefore.id })
      .loginAs(video.section.course.owner);

    response.assertStatus(422);
    response.assertBody({
      error: "Video do not belong to them same course",
    });
  });

  test("should return video object with position updated", async ({
    client,
  }) => {
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();
    const videoBefore = await VideoFactory.merge({
      sectionId: video.sectionId,
    }).create();

    const response = await client
      .post(`api/v1/videos/${video.id}/reorder`)
      .json({ videoBefore: videoBefore.id })
      .loginAs(video.section.course.owner);

    response.assertStatus(200);
    response.assertBodyContains({
      position: videoBefore.position + 1,
      section_id: video.sectionId,
    });
  });

  test("should return video object with position updated to first", async ({
    client,
  }) => {
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();

    const response = await client
      .post(`api/v1/videos/${video.id}/reorder`)
      .json({ videoBefore: null })
      .loginAs(video.section.course.owner);

    response.assertStatus(200);
    response.assertBodyContains({
      position: 1,
      section_id: video.sectionId,
    });
  });

  test("should return video object with position updated with different sections", async ({
    client,
  }) => {
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) => course.with("owner"))
    ).create();
    const videoBefore = await VideoFactory.with("section", 1, (section) =>
      section.merge({ courseId: video.section.courseId })
    ).create();

    const response = await client
      .post(`api/v1/videos/${video.id}/reorder`)
      .json({ videoBefore: videoBefore.id })
      .loginAs(video.section.course.owner);

    response.assertStatus(200);
    response.assertBodyContains({
      position: videoBefore.position + 1,
      section_id: videoBefore.sectionId,
    });
  });
});
