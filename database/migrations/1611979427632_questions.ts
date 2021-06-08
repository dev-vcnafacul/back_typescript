import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { EnemArea, Materias, Frentes, StatusQuestion } from '../../Projetos/BancoQuestoes/Const/ConstantesEnem'

export default class Questions extends BaseSchema {
  protected tableName = 'questoes'

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
      table
        .integer('exam_id')
        .unsigned()
        .references('id')
        .inTable('exams')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('imagem_link').notNullable().unique()
      // Areas do Enem, uma boa forma de entender a pergunta
      table.enum('enem_area', EnemArea).notNullable()
      // Dificuldade da questão de 0 a 100
      table.enum('materia', Materias).notNullable()
      // Esse Campo precisa se enum com todas as frentes bem listadas
      table.enum('frente_1', Frentes).notNullable()
      table.enum('frente_2', Frentes).notNullable()
      table.enum('frente_3', Frentes).notNullable()
      // Toda questão é cadastrada como pendente e precisa ser aprovada por um adm/professor
      table.integer('dificuldade').defaultTo(0).notNullable()
      // Quantidades de vezes que essa questão foi respondida
      table.integer('vezesRespondida').defaultTo(0).notNullable()
      // Quantidade de vezes que essa questão apareceu em simulados diferentes
      table.integer('quantidadeTestes').defaultTo(0).notNullable()
      table.json('historico').defaultTo(0).notNullable()
      // Que ano
      table.integer('ano').notNullable()
      table.enum('status', StatusQuestion).defaultTo('aprovada')
      table.enum('alternativa', ['A', 'B', 'C', 'D', 'E']).notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
