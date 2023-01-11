import Factory from "@ioc:Adonis/Lucid/Factory";
import { nanoid } from "nanoid";

import Course from "App/Models/Course";
import Section from "App/Models/Section";
import User, { Platforms } from "App/Models/User";
import Video from "App/Models/Video";

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    username: faker.internet.userName().toLowerCase(),
    name: faker.name.fullName(),
    profession: faker.name.jobArea(),
    biography: faker.lorem.paragraph(2),
    socialLinks: [{ platform: Platforms.Facebook, link: faker.internet.url() }],
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
  };
}).build();

export const CourseFactory = Factory.define(Course, ({ faker }) => {
  return {
    name: faker.lorem.words(),
    shortDescription: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    willLearn: faker.lorem.sentence(),
    thumbnail: nanoid() + ".jpg",
    price: Math.floor(Math.random() * 30),
  };
})
  .relation("owner", () => UserFactory)
  .build();

export const SectionFactory = Factory.define(Section, ({ faker }) => {
  return {
    name: faker.lorem.words(),
    position: parseInt(faker.random.numeric(2)),
  };
})
  .relation("course", () => CourseFactory)
  .build();

export const VideoFactory = Factory.define(Video, ({ faker }) => {
  return {
    name: faker.lorem.words(),
    description: faker.lorem.paragraph(),
  };
})
  .relation("section", () => SectionFactory)
  .build();
