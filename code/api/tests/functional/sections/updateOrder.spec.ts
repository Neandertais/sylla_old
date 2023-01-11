import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { SectionFactory, UserFactory } from "Database/factories";

test.group("Course sections update order", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("should return unauthorized when not logged", async ({ client }) => {
    const response = await client.post("api/v1/sections/any/reorder");

    response.assertStatus(401);
  });

  test("should return not found when section not exists", async ({
    client,
  }) => {
    const user = await UserFactory.create();

    const response = await client
      .post("api/v1/sections/any/reorder")
      .loginAs(user);

    response.assertStatus(404);
    response.assertBody({ error: "Section not found" });
  });

  test("should return unauthorized when logged in user is not the course owner", async ({
    client,
  }) => {
    const user = await UserFactory.create();
    const section = await SectionFactory.with("course", 1, (course) =>
      course.with("owner")
    ).create();

    const response = await client
      .post(`api/v1/sections/${section.id}/reorder`)
      .json({ sectionBefore: null })
      .loginAs(user);

    response.assertStatus(401);
    response.assertBody({ error: "Unauthorized" });
  });

  test("should return not found when sectionBefore not exists", async ({
    client,
  }) => {
    const section = await SectionFactory.with("course", 1, (course) =>
      course.with("owner")
    ).create();

    const response = await client
      .post(`api/v1/sections/${section.id}/reorder`)
      .json({ sectionBefore: "123456712345671234567" })
      .loginAs(section.course.owner);

    response.assertStatus(404);
    response.assertBody({ error: "Section before not found" });
  });

  test("should return unprocessable when sections are from courses are different", async ({
    client,
  }) => {
    const section = await SectionFactory.with("course", 1, (course) =>
      course.with("owner")
    ).create();
    const sectionBefore = await SectionFactory.with("course").create();

    const response = await client
      .post(`api/v1/sections/${section.id}/reorder`)
      .json({ sectionBefore: sectionBefore.id })
      .loginAs(section.course.owner);

    response.assertStatus(422);
    response.assertBody({
      error: "Sections do not belong to them same course",
    });
  });

  test("should return section object with position updated", async ({
    client,
  }) => {
    const section = await SectionFactory.with("course", 1, (course) =>
      course.with("owner")
    ).create();
    const sectionBefore = await SectionFactory.merge({
      courseId: section.courseId,
    }).create();

    const response = await client
      .post(`api/v1/sections/${section.id}/reorder`)
      .json({ sectionBefore: sectionBefore.id })
      .loginAs(section.course.owner);

    response.assertStatus(200);
    response.assertBodyContains({
      position: sectionBefore.position + 1,
    });
  });
});
