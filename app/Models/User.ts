import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Token from 'App/Models/Token'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public nome: string

  @column()
  public sobrenome: string

  @column()
  public telefone: string

  @column()
  public genero: string

  @column()
  public nascimento: Date

  @column()
  public estado: string

  @column()
  public cidade: string

  @column()
  public professor: boolean

  @column()
  public sobre: string

  @column()
  public rememberMeToken?: string

  @column({ serializeAs: null })
  public admin: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Token)
  public token: HasMany<typeof Token>

  @beforeSave()
  public static async hashPassword(auth: User) {
    if (auth.$dirty.password) {
      auth.password = await Hash.make(auth.password)
    }
  }
}
