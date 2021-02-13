import BaseSchema from '@ioc:Adonis/Lucid/Schema'

const EnemArea = ['Ciências Humanas', 'Ciências da Natureza', 'Linguagens', 'Matemática']

const frentes = [
  'Botânica e ecologia',
  'Fisiologia animal e origem da vida',
  'Metabolismo celular, Bioquímica e Genética',
  'Eletromagnetismo',
  'Mecânica',
  'Óptica e Térmica',
  'Aritmética e Algebra',
  'Financeira e Trigonometria',
  'Geometria',
  'Físico-Química',
  'Química Geral',
  'Química Orgânica',
  'Atualidade',
  'Filosofia',
  'Sociologia',
  'Geografia do Brasil',
  'Geografia Geral',
  'História do Brasil',
  'História Geral',
  'Artes',
  'Espanhol',
  'Gramática',
  'Inglês',
  'Literatura',
  'Leitura e Produção de Texto',
  'Tecnologias da Informação e Comunicação',
]

export default class Questions extends BaseSchema {
  protected tableName = 'questions'

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
      table
        .enum('subjects', [
          'História',
          'Geografia',
          'Filosofia',
          'Sociologia',
          'Química',
          'Física',
          'Biologia',
          'Língua Portuguesa',
          'Literatura',
          'Artes',
          'Educação Física',
          'Tecnologia da Informação e Comunicação',
          'Matemática',
        ])
        .notNullable()
      // Esse Campo precisa se enum com todas as frentes bem listadas
      table.enum('frente_1', frentes).notNullable()
      table.enum('frente_2', frentes).notNullable()
      table.enum('frente_3', frentes).notNullable()
      // Toda questão é cadastrada como pendente e precisa ser aprovada por um adm/professor
      table.integer('difficulty').defaultTo(0).notNullable()
      // Quantidades de vezes que essa questão foi respondida
      table.integer('quantity').defaultTo(0).notNullable()
      // Quantidade de vezes que essa questão apareceu em simulados diferentes
      table.integer('quantity_test').defaultTo(0).notNullable()
      table.json('history_test').defaultTo(0).notNullable()
      // Que ano
      table.integer('year').notNullable()
      table.enum('status', ['aprovada', 'reprovada', 'pendente']).defaultTo('aprovada')
      table.enum('correct', ['A', 'B', 'C', 'D', 'E']).notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
