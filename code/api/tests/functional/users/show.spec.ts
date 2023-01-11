import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";

test.group("Users show", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return user object when user exists", async ({ client }) => {
    const user = await UserFactory.create();

    const response = await client.get(`api/v1/users/${user.username}`);

    response.assertStatus(200);
    response.assertBodyContains({
      username: user.username,
      email: user.email,
      cash: user.cash,
    });
  });

  test("should return not found when user not exists", async ({ client }) => {
    const response = await client.get("api/v1/users/any");

    response.assertStatus(404);
    response.assertBody({ error: "User not found" });
  });
});
