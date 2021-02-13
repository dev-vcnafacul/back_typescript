import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = 'http://localhost:3333'

let send = {
  email: 'anotherTest2@gmail.com',
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

test.group('Question', (group) => {
  group.before(async () => {
    const user = new User()
    user.email = send.email
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
  })

  test('create a new Question', async (assert) => {
    const login = await supertest(BASE_URL).post('/login').expect(200).send({
      email: send.email,
      password: send.password,
    })

    await supertest(BASE_URL)
      .post('/newexam')
      .expect(200)
      .send({ exam: 'enem', location: 'BR' })
      .set({ Authorization: `bearer ${login.body.token.token}` })

    const pathImage = __dirname + '/ImageTest.png'

    const responseQuestion = await supertest(BASE_URL)
      .post('/newquetion')
      .expect(200)
      .field('enemArea', 'Ciências Humanas')
      .field('subjects', 'História')
      .field('frente1', 'História do Brasil')
      .field('frente2', 'Atualidade')
      .field('frente3', 'Literatura')
      .field('year', 2019)
      .field('examId', 2)
      .field('correct', 'A')
      .attach('question', pathImage)
      .set({ Authorization: `bearer ${login.body.token.token}` })

    const selectQuestion = await supertest(BASE_URL)
      .get(`/selectquestion/${responseQuestion.body.id}`)
      .expect(200)
      .set({ Authorization: `bearer ${login.body.token.token}` })

    assert.equal(selectQuestion.body.subjects, 'História')

    await supertest(BASE_URL)
      .delete(`/deletequetion/${responseQuestion.body.id}`)
      .expect(200)
      .set({ Authorization: `bearer ${login.body.token.token}` })
  })
})
