import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EnensController {
  public AllEnem({ response }: HttpContextContract) {
    const value = {
      'Ciencias Humanas': {
        História: ['História do Brasil', 'História Geral'],
        Geografia: ['Geografia Geral', 'Geografia do Brasil'],
        Filosofia: ['Filosofia'],
        Sociologia: ['Sociologia'],
      },
      'Ciencias da Natureza': {
        Física: ['Eletromagnetismo', 'Mecânica', 'Óptica e Térmica'],
        Química: ['Físico-Química', 'Química Geral', 'Química Orgânica'],
        Biologia: [
          'Botânica e Ecologia',
          'Fisiologia animal e origem da vida',
          'Metabolismo celular, Bioquímica e Genética',
        ],
      },
      'Linguagem': {
        'Língua Portuguesa': ['Gramática', 'Leitura e Produção de Texto'],
        'Literatura': ['Literatura'],
        'Língua Estrangeiras': ['Inglês', 'Espanhol'],
        'Artes': ['Artes'],
        'Tecnologias da Informação e Comunicação': ['Tecnologias da Informação e Comunicação'],
        'Educação Física': ['Educação Física'],
      },
      'Matemática': {
        Matemática: ['Aritmética e Algebra', 'Financeira e Trigonometria', 'Geometria'],
      },
    }

    return response.json(value)
  }
}
