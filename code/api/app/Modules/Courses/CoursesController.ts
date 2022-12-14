import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Course from 'App/Models/Course'
import User from 'App/Models/User'
import { randomUUID } from 'node:crypto'

export default class CoursesController {
  public async createCourse({ auth, request, response }: HttpContextContract) {
    const newCourseSchema = schema.create({
      name: schema.string([rules.minLength(12), rules.maxLength(60)]),
      description: schema.string([rules.minLength(12), rules.maxLength(200)]),
      price: schema.number(),
    })

    const payload = await request.validate({ schema: newCourseSchema })

    const course = new Course()
    course.fill(payload)

    const thumbnailImage = request.file('thumbnail', {
      size: '5mb',
      extnames: ['jpg', 'png', 'webp'],
    })

    if (thumbnailImage) {
      const filename = `${randomUUID().replace(/-/g, '')}.${thumbnailImage.extname}`

      await thumbnailImage.moveToDisk('./', {
        name: filename,
      })

      course.thumbnailUrl = filename
    }

    await course.related('owner').associate(auth.user!)

    const courseData = await course.save()

    return response.status(201).send({
      data: courseData.toJSON(),
    })
  }

  public async findCourse({ params, response }: HttpContextContract) {
    const courseId = params.id

    const course = await Course.find(courseId)

    if (!course) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    return course
  }

  public async listCoursesByUsername({ params, response }: HttpContextContract) {
    const username = params.username
    const user = await User.find(username)

    if (!user) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    const courses = await Course.query().where('ownerId', username)

    return courses
  }

  public async updateCourse({ auth, params, request, response }: HttpContextContract) {
    const courseId = params.id

    const course = await Course.find(courseId)

    if (!course) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    if (course.ownerId !== auth.user?.username) {
      return response.status(401).send({ message: 'Unauthorized' })
    }

    const updateCourseSchema = schema.create({
      name: schema.string([rules.minLength(12), rules.maxLength(60)]),
      description: schema.string([rules.minLength(12), rules.maxLength(200)]),
      price: schema.number(),
    })

    const payload = await request.validate({ schema: updateCourseSchema })

    course.merge(payload)

    const thumbnailImage = request.file('thumbnail', {
      size: '5mb',
      extnames: ['jpg', 'png', 'webp'],
    })

    if (thumbnailImage) {
      const filename = `${randomUUID().replace(/-/g, '')}.${thumbnailImage.extname}`

      await thumbnailImage.moveToDisk('./', {
        name: filename,
      })

      course.thumbnailUrl = filename

      // TODO - remove image
    }

    await course.save()

    return course
  }

  public async deleteCourse({ auth, params, response }: HttpContextContract) {
    const courseId = params.id

    const course = await Course.find(courseId)

    if (!course) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    if (course.ownerId !== auth.user?.username) {
      return response.status(401).send({ message: 'Unauthorized' })
    }

    await course.delete()

    // TODO - remove image

    return { message: 'Course deleted successfully' }
  }
}
