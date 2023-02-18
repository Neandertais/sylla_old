import {
  BaseModel,
  beforeCreate,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
} from "@ioc:Adonis/Lucid/Orm";
import { nanoid } from "nanoid";

import User from "App/Models/User";

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column({ serializeAs: "shortDescription" })
  public shortDescription: string;

  @column()
  public description: string;

  @column({ serializeAs: "willLearn" })
  public willLearn: string;

  @column()
  public thumbnail: string;

  @column()
  public price: number;

  @column()
  public ownerId: string;

  @belongsTo(() => User, {
    foreignKey: "ownerId",
    localKey: "username",
  })
  public owner: BelongsTo<typeof User>;

  @beforeCreate()
  public static async generateId(course: Course) {
    course.id = nanoid();
  }

  @beforeSave()
  public static async convertPriceToInteger(course: Course) {
    if (course.$dirty.price) {
      course.price = Math.round(course.price);
    }
  }
}
