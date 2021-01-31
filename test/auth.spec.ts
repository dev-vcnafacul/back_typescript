import test from 'japa'
import supertest from 'supertest'

const BASE_URL = 'http://localhost:3333'

let send = {
  email: 'test@gmail.com',
  password: '123456',
  password_confirmation: '123456',
  first_name: 'Test',
  last_name: 'Adonis',
  phone: '(11)9xxxx-xxxx',
  gender: 'Male',
  birthday: '1989-06-26',
  state: 'SP',
  city: 'São Paulo',
  is_teacher: 0,
}

const fields = [
  'email',
  'password',
  'first_name',
  'last_name',
  'phone',
  'gender',
  'birthday',
  'state',
  'city',
  'is_teacher',
]

test.group('Auth', () => {
  test('register a student', async (assert) => {
    const data = await supertest(BASE_URL).post('/register').expect(200).send(send)
    assert.equal(data.body.email, send.email)
  })
  test('register without nothing', async (assert) => {
    const newsend = {}
    const data = await supertest(BASE_URL).post('/register').expect(422).send(newsend)
    const errors = data.body.errors
    for (let i = 0; i < 10; i++) {
      assert.equal(errors[i].field, fields[i])
    }
  })
  test('register password_confirmed wrong', async (assert) => {
    const newsend = send
    newsend.email = 'test3@gmail.com'
    newsend.password_confirmation = '123457'
    const data = await supertest(BASE_URL).post('/register').expect(422).send(newsend)
    const errors = data.body.errors
    assert.equal(errors[0].field, 'password_confirmation')
    assert.equal(errors[0].message, 'confirmed validation failed')
  })

  test('login without nothing', async (assert) => {
    const login0 = {}
    const data = await supertest(BASE_URL).post('/login').expect(400).send(login0)
    assert.equal(data.body.errors[0].message, 'Invalid user credentials')
  })

  test('login without email', async (assert) => {
    const login1 = { password: '123456' }
    const data = await supertest(BASE_URL).post('/login').expect(400).send(login1)
    assert.equal(data.body.errors[0].message, 'Invalid user credentials')
  })

  test('login without password', async (assert) => {
    const login2 = { email: 'test@gmail.com' }
    const data = await supertest(BASE_URL).post('/login').expect(400).send(login2)
    assert.equal(data.body.errors[0].message, 'Invalid user credentials')
  })

  test('login with email wrong', async (assert) => {
    const login3 = { email: 'test4@gmail.com', password: '123456' }
    const data = await supertest(BASE_URL).post('/login').expect(400).send(login3)
    assert.equal(data.body.errors[0].message, 'Invalid user credentials')
  })

  test('login with password wrong', async (assert) => {
    const login4 = { email: 'test@gmail.com', password: '123457' }
    const data = await supertest(BASE_URL).post('/login').expect(400).send(login4)
    assert.equal(data.body.errors[0].message, 'Invalid user credentials')
  })

  test('login with all correct', async (assert) => {
    const login5 = { email: 'test@gmail.com', password: '123456' }
    const data = await supertest(BASE_URL).post('/login').expect(200).send(login5)
    assert.equal(data.body.user.email, login5.email)
  })

  test('me return', async (assert) => {
    const login5 = { email: 'test@gmail.com', password: '123456' }
    const responseLogin = await supertest(BASE_URL).post('/login').expect(200).send(login5)

    const responseMe = await supertest(BASE_URL)
      .get('/me')
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })

    assert.exists(responseMe.body.email)
  })

  test('patchme change first_name', async (assert) => {
    const login6 = { email: 'test@gmail.com', password: '123456' }
    const responseLogin = await supertest(BASE_URL).post('/login').expect(200).send(login6)

    await supertest(BASE_URL)
      .patch('/patchme')
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
      .send({ first_name: 'Teste' })

    const responseMe = await supertest(BASE_URL)
      .get('/me')
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })

    assert.equal(responseMe.body.first_name, 'Teste')
  })
})
