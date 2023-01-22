import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "videos";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("id", 21).primary();
      table.string("name", 100);
      table.string("description", 5000);
      table.string("video", 26);
      table.integer("status");
      table.jsonb("qualities");
      table.integer("duration");
      table.integer("position");

      table.string("section_id", 30).references("sections.id");
      table.timestamp("created_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
