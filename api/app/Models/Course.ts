import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { nanoid } from 'nanoid'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public thumbnailUrl: string

  @column()
  public price: number

  @column()
  public ownerId: string

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
    localKey: 'username',
  })
  public owner: BelongsTo<typeof User>

  @beforeCreate()
  public static async generateId(course: Course) {
    course.id = nanoid(12)
  }
}
