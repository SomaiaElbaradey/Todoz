const express = require('express')
const postRouter = new express.Router();
const auth = require('../middlewares/auth')
const idHandle = require('../middlewares/idHandle')
const { getPosts, addPost, deletePost, todosFilter, updatePost } = require('../controllers/post')

postRouter.post('/todos', auth, addPost)
postRouter.get('/todos', auth, getPosts)
postRouter.delete('/todos/:id', [auth, idHandle], deletePost)
postRouter.get('/todo', auth, todosFilter)
postRouter.patch('/todo/:id', [auth, idHandle], updatePost)

module.exports = postRouter;