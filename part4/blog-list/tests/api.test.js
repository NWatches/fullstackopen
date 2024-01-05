const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const { pigLoginToken } = require('../utils/pigLoginToken')

// initialize list of some blogs
const initialBlogs = [
	{
		'users': [],
		'title': 'Sample Blog',
		'author': 'John Doe',
		'url': 'https://example.com/sample-blog',
		'likes': 10,
	},
	{
		'users': [],
		'title': 'Example Blog',
		'author': 'Squidward Tentacles',
		'url': 'https://squidward.com/clarinets',
		'likes': 100,
	},
	{
		'users': [],
		'title': 'Test Blog',
		'author': 'Buidward Bentacles',
		'url': 'https://bquidward.com/barinets',
		'likes': 10,
	}
]

const initialUsers = [
	{
		'username': 'Pig',
		'name': 'Pigward',
		'password': 'fq210r9rfqq'
	},
	{
		'username': 'Dog',
		'name': 'Dogathon',
		'password': '21904f1hde'
	},
	{
		'username': 'Cat',
		'name': 'Catica',
		'password': 'ffuqh149873f'
	}
]

beforeAll(async () => {
	await Blog.deleteMany({})
	console.log('Blogs cleared')

	initialBlogs.forEach(async (blog) => {
		let blogObject	= new Blog(blog)
		await blogObject.save()
		console.log('Blogs saved')
	})

	await User.deleteMany({})
	console.log('Users cleared')

	/*for (const userData of initialUsers) {
		let userObject = new User(userData)

		const passwordHash = await bcrypt.hash(userObject.password, 10)
		const user = new User({ username: userObject.username, passwordHash })

		await user.save()
		console.log('Users saved')

	}*/

	const passwordHash = await bcrypt.hash('fq210r9rfqq', 10)
	const user = new User({ username: 'Pig', passwordHash })

	await user.save()
	
	console.log('done')
})

test('blog posts returned', async () => {
	const response = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)

	console.log(response.body)
})

test('verifies unique identifier property is named id', async() => {
	const response = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const posts = response.body
	expect(posts[0].id.toBeDefined)
})

test('verifies if like property is missing', async() => {
	const response = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const posts = response.body
	if (!posts[0].likes) {
		expect(response.body.likes).toBe(0)
	} else {
		expect(posts[0].likes.toBeDefined)
	}
})

test('verifies making POST request successfuly creates new blog post', async() => {
	const newPost = {
		'title': 'Test Blog',
		'author': 'Squirrel Girl',
		'url': 'https://squirrel.com/girl',
		'likes': 923
	}

	const initialResponse = await api.get('/api/blogs')
	const initialLength = initialResponse.body.length

	/*const userPosting = {
		username: 'Pig',
		password: 'fq210r9rfqq'
	}

	const loginResponse = await api
		.post('/api/login')
		.send(userPosting)
		.expect(200)

	const token = loginResponse.body.token
	console.log('tokken', token)*/

	const token = await pigLoginToken()

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${token}`)
		.send(newPost)
		.expect(201)

	const updatedBlog = await api.get('/api/blogs')
	const updatedLength = updatedBlog.body.length
	expect(updatedLength).toBe(initialLength + 1)
})

describe('tests that require user token auth', () => {
	test('verifies if likes property is missing from request, default will be 0', async() => {
		const newPost = {
			'title': 'Default Likes Test Blog',
			'author': 'Harry Mason',
			'url': 'https://mydaughter.com/cheryl'
		}

		const token = await pigLoginToken()

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newPost)
			.expect(201)

		const response = await api.get('/api/blogs')
		const newBlogPost = response.body.find(blog => blog.title == newPost.title)
		expect(newBlogPost.likes).toBe(0)
	})

	test('verifies that posts sent with title or url missing return 400 Bad Request status codes', async() => {
		const newPost = {
			'author': 'Anon Y Mouse',
			'likes': 149
		}

		const token = await pigLoginToken()
		
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newPost)
			.expect(400)
	})

	test('deletes a post', async() => {
		const newBlog = {
			'title': 'Delete Blog',
			'author': 'Pearl Krabs',
			'url': 'https://pearl.com/money',
			'likes': 420
		}

		const token = await pigLoginToken()

		const response = await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(201)

		const blogID = response.body.id
		
		
		await api
			.delete(`/api/blogs/${blogID}`)
			.expect(204)

		const verifyResponse = await api.get(`/api/blogs/${blogID}`)

		expect(verifyResponse.body).toBe(null)
	})

	test('updates likes', async() => {
		const newBlog = {
			'title': 'Update Likes Blog',
			'author': 'Gary Snail',
			'url': 'https://gary.com/shell',
			'likes': 129
		}

		const token = await pigLoginToken()

		const response = await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(201)

		const updatedID = response.body.id

		const updatedLikes = 333

		await api
			.put(`/api/blogs/${updatedID}`)
			.send({ likes: updatedLikes })
			.expect(200)

		const finalResponse = await api.get(`/api/blogs/${updatedID}`)
		expect(finalResponse.body.likes).toBe(updatedLikes)

	})

	describe('ensures invalid users not created and invalid users return error', () => {
		const invalidUsernameMissing = {
			'name': 'S3dfasd',
			'password': 'basdav'
		}
		
		test('username missing', async() => {
			await api
				.post('/api/users')
				.send(invalidUsernameMissing)
				.expect(400)
		})

		const invalidUsernameLessThan3 = {
			'username': 'as',
			'name': 'blorgwort',
			'password': 'deialsdc'
		}

		test('username less than 3 characters', async() => {
			await api
				.post('/api/users')
				.send(invalidUsernameLessThan3)
				.expect(400)
		})

		const invalidPasswordLessThan3 = {
			'username': 'squeaky',
			'name': 'sqeuakers',
			'password': 'so'
		}

		test('password less than 3 characters', async() => {
			await api
				.post('/api/users')
				.send(invalidPasswordLessThan3)
				.expect(400)
		})

		const duplicateUsernameTest = {
			'username': 'boglop',
			'name': 'Jorshi',
			'password': 'beagelweld'
		}

		const invalidDuplicateUsernameTest = {
			'username': 'boglop',
			'name': 'Tgilre',
			'password': 'geidlaqowf'
		}

		beforeEach(async () => {
			await User.deleteOne({ username: 'boglop' })
		})
		
		test('username unique', async() => {
			await api
				.post('/api/users')
				.send(duplicateUsernameTest)
				.expect(201)

			await api
				.post('/api/users')
				.send(invalidDuplicateUsernameTest)
				.expect(400)
		})
	})
})
// write expect for content type, go over chapter 4 to ensure you did this right + beforeAll
afterAll(async () => {
	await mongoose.connection.close()
})
