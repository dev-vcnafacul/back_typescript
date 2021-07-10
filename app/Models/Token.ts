import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'user_id'})
  public userId: number

  @column()
  public type: string

  @column()
  public name: string

  @column()
  public token: string

  @hasOne(() => User)
  public user: HasOne<typeof User>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  public createdAt: DateTime

  @column({ columnName: 'expires_at'})
  public expiresAt: Boolean
}
