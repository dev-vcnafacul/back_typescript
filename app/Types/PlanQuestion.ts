import { Frentes, Subjects, EnemArea } from "App/Enums/Enem";

export enum Correct {
    A,
    B,
    C,
    D,
    E
}

export type Indices = {
  imagem: string,
  exam: string,
  year: number,
  enemArea: EnemArea,
  materia: Subjects,
  frente1: Frentes,
  frente2: Frentes | null,
  frente3: Frentes | null,
  correct: Correct,
}
