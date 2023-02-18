import {
  BaseModel,
  beforeCreate,
  belongsTo,
  BelongsTo,
  column,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";

import Section from "App/Models/Section";

enum VideoQualities {
  "1080p",
  "720p",
  "480p",
  "360p",
}

export enum VideoStatus {
  "unpublished",
  "processing",
  "error:has sexual content",
  "error:internal error",
  "published",
}

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
  public status: VideoStatus;

  @column()
  public duration: string;

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  public qualities: VideoQualities[];

  @column()
  public position: number;

  @column()
  public sectionId: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @belongsTo(() => Section, { serializeAs: null })
  public section: BelongsTo<typeof Section>;

  @beforeCreate()
  public static async generateId(video: Video) {
    video.id = nanoid();
  }

  @beforeCreate()
  public static async assignVideoStatus(video: Video) {
    video.status = VideoStatus.unpublished;
  }
}
