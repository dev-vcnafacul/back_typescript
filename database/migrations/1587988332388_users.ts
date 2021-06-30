import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 250).notNullable().unique()
      table.string('password').notNullable()
      table.string('nome', 25).notNullable()
      table.string('sobrenome', 50).notNullable()
      table.string('telefone').notNullable()
      table.enum('genero', ['Masculino', 'Feminino', 'Outros']).notNullable()
      table.date('nascimento').notNullable()
      table.string('estado').notNullable()
      table.string('cidade').notNullable()
      table.boolean('professor').notNullable()
      table.text('sobre')
      table.boolean('admin').notNullable().defaultTo(false)
      table.string('remember_me_token').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
