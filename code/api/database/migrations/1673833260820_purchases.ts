import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "purchases";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .string("user_id", 26)
        .references("users.username")
        .onDelete("CASCADE");
      table
        .string("course_id", 26)
        .references("courses.id")
        .onDelete("CASCADE");

      table.primary(["user_id", "course_id"]);
      table.timestamp("created_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
