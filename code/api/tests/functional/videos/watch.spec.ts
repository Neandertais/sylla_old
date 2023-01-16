import Database from "@ioc:Adonis/Lucid/Database";
import Drive from "@ioc:Adonis/Core/Drive";
import { file } from "@ioc:Adonis/Core/Helpers";
import { test } from "@japa/runner";
import { UserFactory, VideoFactory } from "Database/factories";

test.group("Videos watch", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return url signed", async ({ client }) => {
    const fakeDrive = Drive.fake();
    const fakeVideo = await file.generateGif("1mb");

    Drive.put("./fakeVideo.gif", fakeVideo.contents);

    const user = await UserFactory.create();
    const video = await VideoFactory.with("section", 1, (section) =>
      section.with("course", 1, (course) =>
        course.merge({ ownerId: user.username })
      )
    )
      .merge({ video: "fakeVideo.gif" })
      .create();

    const response = await client
      .get(`api/v1/videos/${video.id}/watch`)
      .loginAs(user);

    fakeDrive.restore("local");

    response.assertStatus(200);
  });
});
