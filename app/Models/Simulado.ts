import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { ArrayQuestoes } from 'Features/Simulados/Tipos/Simulados'

export default class Simulado extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public tipo: number

  @column()
  public questoes: ArrayQuestoes
  // MÉDIA DE ACERTOS POR PESSOA --- FAZ SENTIDO GUARDAR ASSIM?
  @column()
  public aproveitamento: number

  @column()
  public available: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
