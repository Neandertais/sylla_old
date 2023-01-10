import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

enum Platforms {
  Website = 'Website',
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  LinkedIn = 'LinkedIn',
}

interface SocialLink {
  platform: Platforms
  link: string
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public username: string

  @column()
  public name: string

  @column()
  public profession: string

  @column()
  public biography: string

  @column()
  public avatar: string

  @column()
  public socialLinks: SocialLink[]

  @column()
  public cash: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }

    if (user.$dirty.username) {
      user.username = user.username.toLowerCase()
    }
  }

  @beforeCreate()
  public static async assignInitialValues(user: User) {
    user.cash = 50
  }
}
