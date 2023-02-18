import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

import { UserFactory } from "Database/factories";

test.group("Authentication login", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return error status when not submitting username or email", async ({
    client,
  }) => {
    const response = await client
      .post("api/v1/auth/login")
      .json({ password: "123456789" });

    response.assertStatus(400);
  });

  test("should return bearer token when logged in with username", async ({
    client,
  }) => {
    const user = await UserFactory.make();
    const password = user.password;
    await user.save();

    const response = await client.post("api/v1/auth/login").json({
      username: user.username,
      password,
    });

    response.assertStatus(200);
    response.assertBodyContains({
      type: "bearer",
    });
  });

  test("should return bearer token when logged in with email", async ({
    client,
  }) => {
    const user = await UserFactory.make();
    const password = user.password;
    await user.save();

    const response = await client.post("api/v1/auth/login").json({
      email: user.email,
      password,
    });

    response.assertStatus(200);
    response.assertBodyContains({
      type: "bearer",
    });
  });

  test("should return error status when username not exist in database", async ({
    client,
  }) => {
    const user = await UserFactory.make();
    const password = user.password;
    await user.save();

    const response = await client.post("api/v1/auth/login").json({
      username: "generic_name",
      password,
    });

    response.assertStatus(401);
    response.assertBody({ error: "Invalid credentials" });
  });

  test("should return error status when password is incorrect", async ({
    client,
  }) => {
    const user = await UserFactory.make();
    await user.save();

    const response = await client.post("api/v1/auth/login").json({
      username: user.username,
      password: "12345678",
    });

    response.assertStatus(401);
    response.assertBody({ error: "Invalid credentials" });
  });
});
