import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TypesSimulados extends BaseSchema {
  protected tableName = 'types_simulados'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().unique()
      table.integer('question').notNullable()
      table.json('rules').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
