import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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
  public enem_area: string

  @column()
  public materia: string

  @column()
  public frente_1: string

  @column()
  public frente_2: string

  @column()
  public frente_3: string

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
  public status: string

  @column({ serializeAs: null })
  public alternativa: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
