const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
// const User = require('../models/users')
/* old get request before async/await refactor
blogRouter.get('/', (request, response) => {
	Blog
		.find({})
		.then(blogs => {
			response.json(blogs)
		})
})
*/

const getTokenFrom = request => {
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '')
	}
	return null
}

blogRouter.get('/', async (request, response) => {
	// const blogs = await Blog.find({})
	const blogs = await Blog
		.find({}).populate('users')
	response.json(blogs)
})

/*blogRouter.post('/', (request, response) => {
	const blog = new Blog(request.body)

	blog
		.save()
		.then(result => {
			response.status(201).json(result)
		})
})
*/

/*blogRouter.post('/', async (request, response) => {
	try {
		const blog = new Blog(request.body)
		const newBlog = await blog.save()
		response.status(201).json(newBlog)
	} catch(error) {
		response.status(400).json({ error: error.message })
	}
})*/
blogRouter.post('/', async (request, response) => {
	const body = request.body
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({ error: 'token invalid' })
	}
	const user = await User.findById(decodedToken.id)

	const blog = new Blog(body)

	const newBlog = await blog.save()
	user.blogs = user.blogs.concat(newBlog._id)
	await user.save()
	
	response.status(201).json(newBlog)
})

// create new blogRouter.post request to include Users by id
// new usersRouter.post
/*
blogRouter.post('/', async (request, response) => {
	const body = request.body

	const user = await User.findById(body.userId)

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user.id
	})

	const savedBlog = await note.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
})
*/

blogRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

blogRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	response.json(blog)
})

blogRouter.put('/:id', async (request, response, next) => {
	const body = request.body

	const newBlog =
		{
			'title': body.title,
			'author': body.author,
			'url': body.url,
			'likes': body.likes
		}

	Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
		.then(updatedBlog => {
			response.json(updatedBlog)
		})
		.catch(error => next(error))
})


module.exports = blogRouter
