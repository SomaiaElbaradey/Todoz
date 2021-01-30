const express = require('express');
const todoRouter = new express.Router()
const auth = require("../middlewares/auth");

const { addTodo, deleteTodo, updateTodo } = require('../controllers/todo')

todoRouter.post('/todosGroup', [auth], addTodo);
todoRouter.delete('/todosGroup/:id', [auth], deleteTodo);
todoRouter.patch('/todosGroup/:id', auth, updateTodo)

module.exports = todoRouter;