import BaseSchema from '@ioc:Adonis/Lucid/Schema'

const definition = ['Completo', 'Área', 'Matéria']

export default class Simulados extends BaseSchema {
  protected tableName = 'simulados'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().unique()
      table.enum('definition', definition)
      table
        .integer('type_id')
        .unsigned()
        .references('id')
        .inTable('types_simulados')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.json('questions').notNullable()
      table.integer('answered').notNullable().defaultTo(0)
      table.integer('idGood').notNullable().defaultTo(0)
      table.boolean('available').defaultTo(false)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
