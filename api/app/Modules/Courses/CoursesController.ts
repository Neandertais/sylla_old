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
  public async findCourse({}: HttpContextContract) {}
  public async updateCourse({}: HttpContextContract) {}
  public async deleteCourse({}: HttpContextContract) {}
}
