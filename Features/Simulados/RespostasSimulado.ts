import Questoes from 'App/Models/Questoes'
import { RespostaCorreta, Resposta } from 'Features/Simulados/Tipos/Resposta'

export default class RespostasSimulado {
  private ObjRespostasSimulado: Resposta[]
  private ObjRespostasCorretas: RespostaCorreta[]

  constructor(ObjAnswer: Resposta[]) {
    this.ObjRespostasSimulado = ObjAnswer
  }

  public async VerificandoResposta(): Promise<RespostaCorreta[]> {
    this.ObjRespostasSimulado.map(async (element: Resposta) => {
      const question = await Questoes.query().where('id', element.idQuestao)

      const send: RespostaCorreta = {
        questao: question[0],
        respostaEstudante: element.alternativa,
        respostaCorreta: question[0].alternativa,
      }
      this.ObjRespostasCorretas.push(send)
    })

    return this.ObjRespostasCorretas
  }
}
