import { DateTime } from "luxon";
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  BelongsTo,
  column,
} from "@ioc:Adonis/Lucid/Orm";
import { randomBytes } from "node:crypto";
import Section from "App/Models/Section";

type VideoQualities = ["1080p"?, "720p"?, "480p"?, "360p"?];

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public video: string;

  @column()
  public duration: string;

  @column()
  public quality: VideoQualities[];

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column()
  public sectionId: string;

  @belongsTo(() => Section, { serializeAs: null })
  public section: BelongsTo<typeof Section>;

  @beforeCreate()
  public static async generateId(section: Video) {
    section.id = randomBytes(6).toString("hex");
  }
}
