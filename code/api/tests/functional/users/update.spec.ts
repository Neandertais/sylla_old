import Drive from "@ioc:Adonis/Core/Drive";
import { file } from "@ioc:Adonis/Core/Helpers";
import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

import { UserFactory } from "Database/factories";

test.group("User edit", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return unauthorized when not logged", async ({ client }) => {
    const response = await client.patch("api/v1/users/any");

    response.assertStatus(401);
  });

  test("should return unauthorized when username is not the same as the logged in user", async ({
    client,
  }) => {
    const user = await UserFactory.create();

    const response = await client.patch("api/v1/users/any").loginAs(user);

    response.assertStatus(401);
  });

  test("should return user object with updated properties", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const fakeUser = await UserFactory.make();

    const newUser = {
      username: fakeUser.username,
      name: fakeUser.name,
      profession: fakeUser.profession,
      biography: fakeUser.biography,
      social_links: fakeUser.socialLinks,
    };

    const response = await client
      .patch(`api/v1/users/${user.username}`)
      .json(newUser)
      .loginAs(user);

    response.assertStatus(200);
    response.assertBodyContains(newUser);
  });

  test("should return user object with updated avatar", async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create();
    const avatar = await file.generateJpg("2mb");

    const fakeDrive = Drive.fake();

    const response = await client
      .put(`api/v1/users/${user.username}`)
      .file("avatar", avatar.contents, { filename: avatar.name })
      .loginAs(user);

    assert.isTrue(await fakeDrive.exists(avatar.name));

    fakeDrive.restore("local");

    response.assertStatus(200);
  });
});
