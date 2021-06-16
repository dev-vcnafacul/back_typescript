import Simulado from '../../app/Models/Simulado'
import TipoSimulado from '../../app/Models/TipoSimulado'
import { ArrayQuestoes, QuestaoPorMaterias, RulesTypes } from 'Projetos/Simulados/Tipos/Simulados'
import { Materias } from '../BancoQuestoes/ConstantesEnem'
import ICriarSimulados from './ICriarSimulados'
import Questoes from '../../app/Models/Questoes'

export default class CriarSimulados implements ICriarSimulados {
  private nome: string
  private tipo: TipoSimulado
  private questoes: Number[]
  private questoesRetorno: ArrayQuestoes
  private questaoPorMaterias: QuestaoPorMaterias
  private idSimulado: number

  constructor(nome: string, tipo: TipoSimulado, questoes: Number[]) {
    this.nome = nome
    this.tipo = tipo
    this.questoes = questoes
  }

  //#region Gettes e Settes
  get Nome() {
    return this.nome;
  }
  set Nome(value) {
    this.nome = value;
  }

  get Tipo() {
    return this.tipo;
  }

  set Tipo(value) {
    this.tipo = value;
  }

  get Questoes() {
    return this.questoes;
  }

  set Questoes(value) {
    this.questoes = value;
  }

  get QuestoesRetorno() {
    return this.questoesRetorno;
  }

  set QuestoesRetorno(value) {
    this.questoesRetorno = value;
  }

  get QuestaoPorMaterias() {
    return this.questaoPorMaterias;
  }

  set QuestaoPorMaterias(value) {
    this.questaoPorMaterias = value;
  }

  get IDSimulado() {
    return this.idSimulado;
  }

  set IDSimulado(value) {
    this.idSimulado = value;
  }

  //#endregion

  private async ConsultaQuestoes() {
    this.questoes.map(async (element) => {
      const questoes: Questoes = await Questoes.findByOrFail('id', element)
      this.QuestaoPorMaterias[questoes.materia].push(questoes)
      this.questoesRetorno[questoes.enem_area][questoes.materia].push(questoes)
    })
  }

  private VerificarRegras(): void {
    this.tipo.regra.map((element: RulesTypes) => {
      if (element.quantidade > this.QuestaoPorMaterias[element.materia].lenght) {
        this.CompletarArrayQuestoes(
          element.quantidade - this.QuestaoPorMaterias[element.materia].lenght,
          element.materia
        )
      }
    })
  }

  private async CompletarArrayQuestoes(quantidade: number, materia: string): Promise<void> {
    let array: number[] = []
    this.QuestaoPorMaterias[materia].forEach((element: Questoes) => {
      array.push(element.id)
    });
    const QuestoesConsultadas: Questoes[] = await Questoes.query()
      .where('materia', materia)
      .limit(quantidade)
      .min('quantidadeTestes')
      .whereNot('id', array)

      QuestoesConsultadas.map((element: Questoes) => {
      this.QuestaoPorMaterias[element.materia].push(element)
      this.QuestoesRetorno[element.enem_area][element.materia].push(element)
    })
  }

  private async UpdateQuestion(idSimulate: number) {
    Materias.map((element) => {
      this.QuestaoPorMaterias[element].map(async (value: Questoes) => {
        value.quantidadeTestes += 1
        value.historico.push(idSimulate)
        await value.save()
      })
    })
  }

  public async CriarSimulados(): Promise<void> {
    this.ConsultaQuestoes()
    if (this.tipo.quantidadeTotalQuestoes > this.questoes.length) {
      this.VerificarRegras()
    }

    const simulate = new Simulado()

    simulate.nome = this.nome
    simulate.tipo = this.tipo.id
    simulate.questoes = this.QuestoesRetorno

    await simulate.save()

    this.UpdateQuestion(simulate.id)

    this.IDSimulado = simulate.id
  }
}
