import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { randomUUID } from 'node:crypto'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Course from 'App/Models/Course'
import Section from 'App/Models/Section'
import Video from 'App/Models/Video'

export default class VideosController {
  public async createVideo({ auth, params, request, response }: HttpContextContract) {
    const course = await Course.find(params.course)

    if (!course) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    if (course?.ownerId !== auth.user?.username) {
      return response.status(401).send({ message: 'Unauthorized' })
    }

    const newVideoSchema = schema.create({
      name: schema.string([rules.minLength(6), rules.maxLength(40)]),
      description: schema.string.optional([rules.maxLength(420)]),
      section: schema.string([rules.minLength(12), rules.maxLength(12)]),
    })

    const payload = await request.validate({ schema: newVideoSchema })

    const section = await Section.find(payload.section)

    if (!section || section.courseId !== course.id) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    const video = new Video()
    video.fill(payload)
    await video.related('section').associate(section)

    const videoUpload = request.file('video', {
      size: '5gb',
      extnames: ['mp4', 'webm', 'mkv', 'avi', 'gif'],
    })

    if (videoUpload) {
      const filename = `${randomUUID().replace(/-/g, '')}.${videoUpload.extname}`

      await videoUpload.moveToDisk('./', {
        name: filename,
      })

      video.video = filename
    }

    await video.save()

    return response.status(201).send(video)
  }

  public async findVideo({ params, response }: HttpContextContract) {
    const course = await Course.find(params.course)

    if (!course) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    const video = await Video.find(params.video)

    if (!video) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    // TODO - check user if he has a course

    await video.load('section')
    await video.section.load('course')

    if (video.section.courseId !== course.id) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    return video
  }

  public async updateVideo({ auth, params, request, response }: HttpContextContract) {
    const course = await Course.find(params.course)
    const video = await Video.find(params.video)

    if (!course || !video) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    if (course?.ownerId !== auth.user?.username) {
      return response.status(401).send({ message: 'Unauthorized' })
    }

    const newVideoSchema = schema.create({
      name: schema.string.optional([rules.minLength(6), rules.maxLength(40)]),
      description: schema.string.optional([rules.maxLength(420)]),
    })

    const payload = await request.validate({ schema: newVideoSchema })
    video.merge(payload)

    await video.save()

    return video
  }

  public async deleteVideo({ auth, params, response }: HttpContextContract) {
    const course = await Course.find(params.course)
    const video = await Video.find(params.video)

    if (!course || !video) {
      return response.status(404).send({ message: 'Resource not found' })
    }

    if (course?.ownerId !== auth.user?.username) {
      return response.status(401).send({ message: 'Unauthorized' })
    }

    await video.delete()

    return { message: 'Video deleted with success' }
  }
}
