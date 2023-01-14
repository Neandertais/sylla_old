import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory, VideoFactory } from "Database/factories";

test.group("Videos show", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return video object when vi;deo exists", async ({ client }) => {
    const user = await UserFactory.create();
    const video = await VideoFactory.create();

    const response = await client
      .get(`api/v1/videos/${video.id}`)
      .loginAs(user);

    response.assertStatus(200);
    response.assertBodyContains({ name: video.name });
  });

  test("should return not found when video not exists", async ({ client }) => {
    const user = await UserFactory.create();
    const response = await client.get("api/v1/videos/any").loginAs(user);

    response.assertStatus(404);
    response.assertBody({ error: "Video not found" });
  });
});
