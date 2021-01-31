import test from 'japa'
import supertest from 'supertest'

const BASE_URL = 'http://localhost:3333'

test.group('Auth', () => {
  test('register a student', async (assert) => {
    const data = await supertest(BASE_URL).post('/register').expect(200).send({
      email: 'fernando.almeida.pinto@gmail.com',
      password: '123456',
      password_confirmation: '123456',
      first_name: 'fernando',
      last_name: 'Almeida',
      phone: '(11)9xxxx-xxxx',
      gender: 'Male',
      birthday: '1989-06-26',
      state: 'SP',
      city: 'São Paulo',
      is_teacher: 0,
    })
    console.log(data)
  })
})
