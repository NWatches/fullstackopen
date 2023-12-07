const blogRouter = require('express').Router()
// const blog = require('../models/blog')
const Blog = require('../models/blog')
/* old get request before async/await refactor
blogRouter.get('/', (request, response) => {
	Blog
		.find({})
		.then(blogs => {
			response.json(blogs)
		})
})
*/

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
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
	const blog = new Blog(body)
	const newBlog = await blog.save()
	response.status(201).json(newBlog)
})

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
