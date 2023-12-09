const _ = require('lodash')

const totalLikes = (blogs) => {
	const reducer = (sum, post) => {
		return sum + post.likes
	}

	return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
	if (blogs.length == 0) {
		return null
	}

	let maxLikes = -1
	let favorite = null

	for (const blog of blogs) {
		if (blog.likes > maxLikes) {
			maxLikes = blog.likes
			favorite = blog
		}
	}

	return {
		title: favorite.title,
		author: favorite.author,
		likes: favorite.likes
	}
}

const mostBlogs = (blogs) => {
	const blogCounts = _.countBy(blogs, 'author')
	let maxKey = _.max(Object.keys(blogCounts), o => blogCounts[o])
	
	let authorMostBlogs = {
		'author': maxKey,
		'blogs': blogCounts[maxKey]
	}

	return authorMostBlogs
}

const mostLikes = (blogs) => {
	if (blogs.length == 0) {
		return null
	}
	const authorLikes = _.groupBy(blogs, 'author')
	console.log('authorLikes: ', authorLikes)
	const authorMostLikes = _.maxBy(_.keys(authorLikes), author => _.sumBy(authorLikes[author], 'likes'))
	console.log(authorMostLikes)
	const mostLikes = _.sumBy(authorLikes[authorMostLikes], 'likes')
	console.log(mostLikes)

	return {
		author: authorMostLikes,
		likes: mostLikes
	}
}

module.exports = {
	//dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}
