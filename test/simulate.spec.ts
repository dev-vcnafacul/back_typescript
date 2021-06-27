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

test.group('Simulados', (group) => {
  group.before(async () => {
    const login = await supertest(BASE_URL).post('/login').expect(200).send({
        email: send.email,
        password: send.password,
      })
  })

  test('2+2', async (assert) => {
    assert.equal(2 + 2, 4)
  }) 
})

