import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Purchase extends BaseModel {
  @column({ isPrimary: true })
  public user_id: string;

  @column({ isPrimary: true })
  public course_id: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;
}
