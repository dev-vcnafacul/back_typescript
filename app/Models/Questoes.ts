import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { Alternativa, EnemArea, Frentes, StatusQuestion, Materias } from '../../Projetos/BancoQuestoes/Enums/Questoes'

export default class Questoes extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public user_id: number

  @column()
  public exam_id: number

  @column()
  public Imagem_link: string

  @column()
  public enem_area: EnemArea

  @column()
  public materia: Materias

  @column()
  public frente_1: Frentes

  @column()
  public frente_2: Frentes

  @column()
  public frente_3: Frentes

  @column({ serializeAs: null })
  public dificuldade: number

  @column({ serializeAs: null })
  public vezesRespondida: number

  @column({ serializeAs: null })
  public quantidadeTestes: number

  @column({ serializeAs: null })
  public historico: number[]

  @column()
  public ano: number

  @column({ serializeAs: null })
  public status: StatusQuestion

  @column({ serializeAs: null })
  public alternativa: Alternativa

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
