import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Course from 'App/Models/Course'
import CourseSection from 'App/Models/CourseSection'

export default class CourseSectionsController {
  public async createSection({ auth, params, request, response }: HttpContextContract) {
    const course = await Course.find(params.course)

    if (!course) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    if (course?.ownerId !== auth.user?.username) {
      return response.status(401).send({ message: 'Unauthorized' })
    }

    const newSectionSchema = schema.create({
      name: schema.string([rules.minLength(6), rules.maxLength(40)]),
    })

    const payload = await request.validate({ schema: newSectionSchema })

    const section = new CourseSection()

    const lastSection = await CourseSection.query()
      .where('courseId', course.id)
      .orderBy('position', 'desc')
      .limit(1)

    if (lastSection.length === 0) {
      section.position = 1
    } else {
      section.position = lastSection[0].position + 1
    }

    section.merge(payload)
    await section.related('course').associate(course)
    await section.save()

    return response.status(201).send(section)
  }

  public async listSections({ params, response }: HttpContextContract) {
    const course = await Course.find(params.course)

    if (!course) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    const sections = await CourseSection.query().where('courseId', course.id)

    return sections
  }

  public async updateSection({ auth, params, request, response }: HttpContextContract) {
    const course = await Course.find(params.course)
    const section = await CourseSection.find(params.id)

    if (!section || !course) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    if (course?.ownerId !== auth.user?.username) {
      return response.status(401).send({ message: 'Unauthorized' })
    }

    const updateSectionSchema = schema.create({
      name: schema.string([rules.minLength(6), rules.maxLength(40)]),
    })

    const payload = await request.validate({ schema: updateSectionSchema })

    await section.merge(payload).save()

    return section
  }
  public async deleteSection({}: HttpContextContract) {}
}
