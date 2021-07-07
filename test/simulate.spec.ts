import test from 'japa'

test.group('Simulados', () => {
  /* group.before(async () => {
    const login = await supertest(BASE_URL).post('/login').expect(200).send({
        email: send.email,
        password: send.password,
      })
  }) */

  test('2+2', async (assert) => {
    assert.equal(2 + 2, 4)
  }) 
})

