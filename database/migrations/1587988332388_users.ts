import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 150).notNullable().unique()
      table.string('password').notNullable()
      table.string('first_name', 25).notNullable()
      table.string('last_name', 50).notNullable()
      table.string('phone').notNullable()
      table.enum('gender', ['Male', 'Female', 'Others']).notNullable()
      table.date('birthday').notNullable()
      table.string('state').notNullable()
      table.string('city').notNullable()
      table.boolean('is_teacher').notNullable()
      table.text('about')
      table.boolean('admin').notNullable().defaultTo(false)
      table.string('remember_me_token').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
