import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 12).primary()
      table.string('name', 40)
      table.string('description', 420)
      table.string('video', 37)
      table.string('duration', 8)
      table.string('quality', 30)

      table.string('course_section_id', 30).references('course_sections.id')
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
