import { Subjects } from 'App/Enums/Question'
import Question from 'App/Models/Question'

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

export type ArrayQuestion = {
  'Ciencias Humanas': {
    História: Question[]
    Geografia: Question[]
    Filosofia: Question[]
    Sociologia: Question[]
  }
  'Ciencias da Natureza': {
    Química: Question[]
    Física: Question[]
    Biologia: Question[]
  }
  'Linguagens': {
    'Língua Portuguesa': Question[]
    'Literatura': Question[]
    'Língua Estrangeiras': Question[]
    'Artes': Question[]
    'Educação Física': Question[]
    'Tecnologia da Informação e Comunicação': Question[]
  }
  'Matemática': {
    Matemática: Question[]
  }
}

export type RulesTypes = {
  subjects: Subjects
  quantify: number
}

export type ArraySubjects = {
  'História': Question[]
  'Geografia': Question[]
  'Filosofia': Question[]
  'Sociologia': Question[]
  'Química': Question[]
  'Física': Question[]
  'Biologia': Question[]
  'Língua Portuguesa': Question[]
  'Literatura': Question[]
  'Língua Estrangeiras': Question[]
  'Artes': Question[]
  'Educação Física': Question[]
  'Tecnologia da Informação e Comunicação': Question[]
  'Matemática': Question[]
  'Atualidade': Question[]
}
