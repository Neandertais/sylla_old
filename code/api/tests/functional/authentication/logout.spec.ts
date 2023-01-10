import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";

test.group("Authentication logout", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return ok status when user is logged in", async ({ client }) => {
    const user = await UserFactory.create();

    const response = await client.post("api/v1/auth/logout").loginAs(user);

    response.assertStatus(200);
    response.assertBody({ loggedOut: true });
  });

  test("should return unauthorized status when user is not logged in", async ({
    client,
  }) => {
    const response = await client.post("api/v1/auth/logout");

    response.assertStatus(401);
  });
});
