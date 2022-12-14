import { BaseModel, beforeCreate, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { randomBytes } from 'node:crypto'
import Course from 'App/Models/Course'

export default class CourseSection extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public position: number

  @column()
  public courseId: string

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @beforeCreate()
  public static async generateId(section: CourseSection) {
    section.id = randomBytes(6).toString('hex')
  }
}
