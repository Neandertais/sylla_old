import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("username", 56).primary();
      table.string("name", 80);
      table.string("profession", 80);
      table.string("biography", 360);
      table.string("avatar", 26);
      table.jsonb("social_links");
      table.integer("cash");

      table.string("email", 320).unique().notNullable();
      table.string("password", 133).notNullable();

      table.timestamp("created_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
