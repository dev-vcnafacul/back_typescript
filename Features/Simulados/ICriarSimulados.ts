import TypesSimulado from "App/Models/TipoSimulado";
import { ArrayQuestoes, QuestaoPorMaterias } from "Features/Simulados/Tipos/Simulados";

export default interface ICriarSimulados{
  Nome: string
  Tipo: TypesSimulado
  Questoes: Number[]
  QuestoesRetorno: ArrayQuestoes
  QuestaoPorMaterias: QuestaoPorMaterias


}