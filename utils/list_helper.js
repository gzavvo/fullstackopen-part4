const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const minimized = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }

  const mostLikes = Math.max(...blogs.map(blog => blog.likes))
  const mostLikedBlog =  blogs.find(blog => blog.likes === mostLikes)
  return minimized(mostLikedBlog)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
