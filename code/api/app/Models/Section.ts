import {
  BaseModel,
  beforeCreate,
  belongsTo,
  BelongsTo,
  column,
  HasMany,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import { nanoid } from "nanoid";

import Course from "App/Models/Course";
import Video from "App/Models/Video";

export default class Section extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public position: number;

  @column()
  public courseId: string;

  @belongsTo(() => Course, { serializeAs: null })
  public course: BelongsTo<typeof Course>;

  @hasMany(() => Video, { serializeAs: null })
  public videos: HasMany<typeof Video>;

  @beforeCreate()
  public static async generateId(section: Section) {
    section.id = nanoid();
  }
}
