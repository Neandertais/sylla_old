import {
  BaseModel,
  beforeCreate,
  belongsTo,
  BelongsTo,
  column,
} from "@ioc:Adonis/Lucid/Orm";
import Course from "App/Models/Course";
import { nanoid } from "nanoid";

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

  @beforeCreate()
  public static async generateId(section: Section) {
    section.id = nanoid();
  }
}
