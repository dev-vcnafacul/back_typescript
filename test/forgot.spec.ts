/* import Token from 'App/Models/Token'
import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = 'http://localhost:3333'

let send = {
  email: 'test@gmail.com',
  password: '123456',
  password_confirmation: '123456',
}

test.group('Forgot', () => {
  test('forgot email', async (assert) => {
    await supertest(BASE_URL).post('/esqueci-minha-senha').expect(200).send({ email: send.email })
    const user = await User.findByOrFail('email', send.email)

    const token = await Token.findByOrFail('user_id', user.id)

    assert.equal(token.userId, user.id)
  }).timeout(10000)

  test('email not exist', async () => {
    await supertest(BASE_URL).post('/forgot').expect(409).send({ email: 'testqualquer@gmail.com' })
  })
}) */
