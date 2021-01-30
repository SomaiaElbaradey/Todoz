const express = require('express')
const postRouter = new express.Router();
const auth = require('../middlewares/auth')
const { getPosts, addPost, deletePost, todosFilter, updatePost } = require('../controllers/post')

postRouter.post('/todos', auth, addPost)
postRouter.get('/todos', auth, getPosts)
postRouter.delete('/todos/:id', auth, deletePost)
postRouter.get('/todo', auth, todosFilter)
postRouter.patch('/todo/:id', auth, updatePost)

module.exports = postRouter;