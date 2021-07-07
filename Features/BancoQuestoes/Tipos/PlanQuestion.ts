import { Alternativa, Frentes, Materias, EnemArea } from "Features/BancoQuestoes/Enums/Questoes";

export type Indices = {
  ImagemLink: string,
  exam: string,
  ano: number,
  enemArea: EnemArea,
  materia: Materias,
  frente1: Frentes,
  frente2: Frentes,
  frente3: Frentes,
  alternativa: Alternativa,
}
