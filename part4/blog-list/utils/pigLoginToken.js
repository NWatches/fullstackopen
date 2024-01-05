const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const pigLoginToken = async () => {
  const userPosting = {
    username: 'Pig',
    password: 'fq210r9rfqq'
  }

  const loginResponse = await api
    .post('/api/login')
    .send(userPosting)
    .expect(200)

  const token = loginResponse.body.token
  // console.log('tokken', token)
  return token
}

module.exports = { pigLoginToken }
