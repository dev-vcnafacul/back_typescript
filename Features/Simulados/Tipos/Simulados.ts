import Questao from 'App/Models/Questoes'

export type ArrayFrentes = {
  'Botânica e Ecologia': number[]
  'Fisiologia animal e origem da vida': number[]
  'Metabolismo celular, Bioquímica e Genética': number[]
  'Eletromagnetismo': number[]
  'Mecânica': number[]
  'Óptica e Térmica': number[]
  'Aritmética e Algebra': number[]
  'Financeira e Trigonometria': number[]
  'Geometria': number[]
  'Físico-Química': number[]
  'Química Geral': number[]
  'Química Orgânica': number[]
  'Atualidade': number[]
  'Filosofia': number[]
  'Sociologia': number[]
  'Geografia do Brasil': number[]
  'Geografia Geral': number[]
  'História do Brasil': number[]
  'História Geral': number[]
  'Artes': number[]
  'Espanhol': number[]
  'Gramática': number[]
  'Inglês': number[]
  'Literatura': number[]
  'Leitura e Produção de Texto': number[]
  'Tecnologias da Informação e Comunicação': number[]
}

export type ArrayQuestoes = {
  'Ciencias Humanas': {
    História: Questao[]
    Geografia: Questao[]
    Filosofia: Questao[]
    Sociologia: Questao[]
    Atualidade: Questao[]
  }
  'Ciencias da Natureza': {
    Química: Questao[]
    Física: Questao[]
    Biologia: Questao[]
  }
  'Linguagens': {
    'Língua Portuguesa': Questao[]
    'Literatura': Questao[]
    'Língua Estrangeiras': Questao[]
    'Artes': Questao[]
    'Educação Física': Questao[]
    'Tecnologia da Informação e Comunicação': Questao[]
  }
  'Matemática': {
    Matemática: Questao[]
  }
}

export type RulesTypes = {
  materia: string
  quantidade: number
}

export type QuestaoPorMaterias = {
  'História': Questao[]
  'Geografia': Questao[]
  'Filosofia': Questao[]
  'Sociologia': Questao[]
  'Química': Questao[]
  'Física': Questao[]
  'Biologia': Questao[]
  'Língua Portuguesa': Questao[]
  'Literatura': Questao[]
  'Língua Estrangeiras': Questao[]
  'Artes': Questao[]
  'Educação Física': Questao[]
  'Tecnologia da Informação e Comunicação': Questao[]
  'Matemática': Questao[]
  'Atualidade': Questao[]
}
