import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Exams extends BaseSchema {
  protected tableName = 'exams'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('exam').unique().notNullable()
      table
        .enum('localizacao', [
          'AC',
          'AL',
          'AP',
          'AM',
          'BA',
          'CE',
          'ES',
          'GO',
          'MA',
          'MT',
          'MS',
          'MG',
          'PA',
          'PB',
          'PR',
          'PE',
          'PI',
          'RJ',
          'RN',
          'RS',
          'RO',
          'RR',
          'SC',
          'SP',
          'SE',
          'TO',
          'DF',
          'BR',
        ])
        .notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
