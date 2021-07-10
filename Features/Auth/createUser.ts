import User from 'App/Models/User'
import { DateTime } from 'luxon';

export default class CreateUser {
  public async createUser(userDetails: {
    email: string;
    password: string;
    nome: string;
    sobrenome: string;
    telefone: string;
    genero: string;
    nascimento: DateTime;
    estado: string;
    cidade: string;
    professor: boolean;
}, sobre: string) {
    try {
      const user = new User()
      user.email = userDetails.email
      user.password = userDetails.password
      user.nome = userDetails.nome
      user.sobrenome = userDetails.sobrenome
      user.telefone = userDetails.telefone
      user.genero = userDetails.genero
      user.nascimento = userDetails.nascimento.toJSDate()
      user.estado = userDetails.estado
      user.cidade = userDetails.cidade
      user.professor = userDetails.professor
      user.sobre = sobre
      await user.save()
      return {erro: false, errorlog: '', user: user}
    } catch (err) {
      return {erro: true, errorlog: err, user: new User()}
    }
  }
}