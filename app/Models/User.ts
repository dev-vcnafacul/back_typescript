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
  public first_name: string

  @column()
  public last_name: string

  @column()
  public phone: string

  @column()
  public gender: string

  @column()
  public birthday: Date

  @column()
  public state: string

  @column()
  public city: string

  @column()
  public is_teacher: boolean

  @column()
  public about: string

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
