import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";

test.group("Authentication signup", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return user object when creating user", async ({ client }) => {
    const user = await UserFactory.make();

    const response = await client.post("api/v1/auth/signup").json({
      ...user,
      password_confirmation: user.password,
    });

    response.assertStatus(201);
    response.assertBodyContains({
      user: {
        username: user.username.toLowerCase(),
        email: user.email.toLowerCase(),
      },
    });
  });

  test("should return error status when username not submitted", async ({
    client,
  }) => {
    const user = await UserFactory.make();

    const response = await client.post("api/v1/auth/signup").json({
      password: user.password,
      password_confirmation: user.password,
      email: user.email,
    });

    response.assertStatus(400);
  });

  test("should return error status when email not submitted", async ({
    client,
  }) => {
    const user = await UserFactory.make();

    const response = await client.post("api/v1/auth/signup").json({
      username: user.username,
      password: user.password,
      password_confirmation: user.password,
    });

    response.assertStatus(400);
  });

  test("should return error status when password not submitted", async ({
    client,
  }) => {
    const user = await UserFactory.make();

    const response = await client.post("api/v1/auth/signup").json({
      username: user.username,
      password_confirmation: user.password,
      email: user.email,
    });

    response.assertStatus(400);
  });

  test("should return error status when password confirmation not submitted", async ({
    client,
  }) => {
    const user = await UserFactory.make();

    const response = await client.post("api/v1/auth/signup").json({
      username: user.username,
      password: user.password,
      email: user.email,
    });

    response.assertStatus(400);
  });

  test("should return error status when username is already in use", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const { email } = await UserFactory.make();

    const response = await client.post("api/v1/auth/signup").json({
      ...user,
      password_confirmation: user.password,
      email,
    });

    response.assertStatus(409);
    response.assertBody({ error: "Username already used" });
  });

  test("should return error status when email is already in use", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const { username } = await UserFactory.make();

    const response = await client.post("api/v1/auth/signup").json({
      ...user,
      password_confirmation: user.password,
      username,
    });

    response.assertStatus(409);
    response.assertBody({ error: "Email already used" });
  });
});
