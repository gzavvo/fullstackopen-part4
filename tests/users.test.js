const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)
const helpers = require('./test_helpers')

describe('when there is initially one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  
  test('adding user fails when no username provided', async () => {
    const usersAtStart = await helpers.usersInDb()
    const newUser = {
      password: 'truc'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helpers.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
  
  test('adding user fails when no password provided', async () => {
    const usersAtStart = await helpers.usersInDb()
    const newUser = {
      username: 'Alfred'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helpers.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
  
  test('adding user fails when password.length < 3', async () => {
    const usersAtStart = await helpers.usersInDb()
    const newUser = {
      username: 'Alfred',
      password: 'bi'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helpers.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
  
  test('adding user fails when username.length < 3', async () => {
    const usersAtStart = await helpers.usersInDb()
    const newUser = {
      username: 'Al',
      password: 'truc'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helpers.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
