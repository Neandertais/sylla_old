import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('username', 56).primary()
      table.string('name', 80)
      table.string('bio', 240)
      table.integer('cash')

      table.string('email', 320).unique()
      table.string('password', 133)

      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
