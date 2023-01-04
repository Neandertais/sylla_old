import Factory from '@ioc:Adonis/Lucid/Factory'

import Course from 'App/Models/Course'
import CourseSection from 'App/Models/CourseSection'
import User from 'App/Models/User'
import Video from 'App/Models/Video'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}).build()

export const CourseFactory = Factory.define(Course, ({ faker }) => {
  return {
    name: faker.lorem.words(),
    description: faker.lorem.sentence(),
    price: Math.floor(Math.random() * 30),
  }
})
  .relation('owner', () => UserFactory)
  .build()

export const CourseSectionFactory = Factory.define(CourseSection, ({ faker }) => {
  return {
    name: faker.lorem.words(),
  }
})
  .relation('course', () => CourseFactory)
  .build()

export const VideoFactory = Factory.define(Video, ({ faker }) => {
  return {
    name: faker.lorem.words(),
    description: faker.lorem.paragraph(),
  }
})
  .relation('section', () => CourseSectionFactory)
  .build()
