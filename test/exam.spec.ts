import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = 'http://localhost:3333'

let send = {
  email: 'testexam@gmail.com',
  password: '123456',
  password_confirmation: '123456',
  first_name: 'Test',
  last_name: 'Adonis',
  phone: '(11)9xxxx-xxxx',
  gender: 'Male',
  birthday: '1989-06-26',
  state: 'SP',
  city: 'São Paulo',
  is_teacher: 1,
}

test.group('Exam', () => {
  test('try create a new exam being a teacher, but not admin', async () => {
    await supertest(BASE_URL).post('/register').expect(200).send(send)

    const responseLogin = await supertest(BASE_URL).post('/login').expect(200).send({
      email: send.email,
      password: send.password,
    })

    await supertest(BASE_URL)
      .post('/newexam')
      .expect(401)
      .send({ exam: 'enem', location: 'BR' })
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
  })

  test('create a new exam being a adm', async (assert) => {
    const user = new User()
    user.email = 'anotherTest@gmail.com'
    user.password = send.password
    user.first_name = send.first_name
    user.last_name = send.last_name
    user.phone = send.phone
    user.gender = send.gender
    user.birthday = new Date()
    user.state = send.state
    user.city = send.city
    user.is_teacher = true
    user.admin = true
    await user.save()

    const responseLogin = await supertest(BASE_URL).post('/login').expect(200).send({
      email: 'anotherTest@gmail.com',
      password: send.password,
    })

    await supertest(BASE_URL)
      .post('/newexam')
      .expect(200)
      .send({ exam: 'enem', location: 'BR' })
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })

    const respListExam = await supertest(BASE_URL)
      .get('/listexam')
      .expect(200)
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })

    assert.exists(respListExam.body[0].exam)
  })

  test('create a exam alread exist', async () => {
    const responseLogin = await supertest(BASE_URL).post('/login').expect(200).send({
      email: 'anotherTest@gmail.com',
      password: send.password,
    })

    await supertest(BASE_URL)
      .post('/newexam')
      .expect(422)
      .send({ exam: 'enem', location: 'BR' })
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
  })

  test('delete a exam alread exist', async () => {
    const responseLogin = await supertest(BASE_URL).post('/login').expect(200).send({
      email: 'anotherTest@gmail.com',
      password: send.password,
    })

    await supertest(BASE_URL)
      .delete('/delexam/1')
      .expect(200)
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
  })

  test('delete a exam not exist', async () => {
    const responseLogin = await supertest(BASE_URL).post('/login').expect(200).send({
      email: 'anotherTest@gmail.com',
      password: send.password,
    })

    await supertest(BASE_URL)
      .delete('/delexam/1')
      .expect(404)
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
  })
})
