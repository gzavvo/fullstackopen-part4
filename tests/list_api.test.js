const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const api = supertest(app)
const helpers = require('./test_helpers')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helpers.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs have a unique identifier property named _id_', async () => {
  const response = await helpers.blogsInDb()

  response.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Art and fear: the ceramics class and quantity before quality',
    author: 'Eric Johnson',
    url: 'https://excellentjourney.net/2015/03/04/art-fear-the-ceramics-class-and-quantity-before-quality/',
    likes: 6
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helpers.blogsInDb()
  expect(blogsAtEnd.length).toBe(helpers.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  expect(titles).toContain(
    'Art and fear: the ceramics class and quantity before quality'
  )
})

test('like property assign to 0 when missing', async () => {
  const newBlog = {
    title: 'Art and fear: the ceramics class and quantity before quality',
    author: 'Eric Johnson',
    url: 'https://excellentjourney.net/2015/03/04/art-fear-the-ceramics-class-and-quantity-before-quality/',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  expect(response.body.likes).toBe(0)
})

test('if title and url property are missing, response has a status code 400', async () => {
  const newBlog = {
    likes: 8
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test.only('deletion of a blog', async () => {
  const blogsAtStart = await helpers.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helpers.blogsInDb()

  expect(blogsAtEnd.length).toBe(helpers.initialBlogs.length -1)
})

test.only('update of a blog', async () => {
  const blogsAtStart = await helpers.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: 666
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
})

afterAll(() => {
  mongoose.connection.close()
})
