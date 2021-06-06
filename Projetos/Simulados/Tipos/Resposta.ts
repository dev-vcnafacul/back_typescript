import Questao from "App/Models/Questoes";
import { Alternativa } from "Projetos/BancoQuestoes/Enums/Questoes";

export type RespostaCorreta = {
    questao: Questao
    respostaEstudante: string
    respostaCorreta: string
}

export type Resposta = {
    idQuestao: number
    alternativa: Alternativa
}