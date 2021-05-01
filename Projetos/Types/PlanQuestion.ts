import { Correct, Frentes, Subjects, EnemArea } from "Projetos/Enums/Question";

export type Indices = {
  ImagemLink: string,
  exam: string,
  year: number,
  enemArea: EnemArea,
  materia: Subjects,
  frente1: Frentes,
  frente2: Frentes,
  frente3: Frentes,
  correct: Correct,
}
