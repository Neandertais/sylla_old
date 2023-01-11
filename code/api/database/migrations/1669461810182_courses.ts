import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "courses";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("id", 21).primary();
      table.string("name", 120);
      table.string("short_description", 560);
      table.string("description", 1200);
      table.string("will_learn", 840);
      table.string("thumbnail", 26);
      table.integer("price");

      table
        .string("owner_id", 56)
        .references("users.username")
        .onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
