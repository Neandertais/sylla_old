import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Course from 'App/Models/Course'
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
      await thumbnailImage.moveToDisk('./', {
        name: `${randomUUID()}.${thumbnailImage.extname}`,
      })

      course.thumbnailUrl = thumbnailImage.fileName || ''
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
      await thumbnailImage.moveToDisk('./', {
        name: `${randomUUID()}.${thumbnailImage.extname}`,
      })

      course.thumbnailUrl = thumbnailImage.fileName!
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

    return { message: 'Course deleted successfully' }
  }
}
