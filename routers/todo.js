const express = require('express');
const todoRouter = new express.Router()
const auth = require("../middlewares/auth");
const idHandle = require("../middlewares/idHandle");

const { addTodo, deleteTodo, updateTodo, getPosts, getGroups, lastMonthTodos, todosAtMonth,
    todosAtDate } = require('../controllers/todo')

todoRouter.post('/todosGroup', auth, addTodo);
todoRouter.delete('/todosGroup/:id', [auth, idHandle], deleteTodo);
todoRouter.patch('/todosGroup/:id', [auth, idHandle], updateTodo);
todoRouter.get('/todosGroup/:id', [auth, idHandle], getPosts);
todoRouter.get('/todosGroup', [auth], getGroups);
todoRouter.get('/lastTodos', [auth], lastMonthTodos);
todoRouter.get('/lastTodos/:month', [auth], todosAtMonth);
todoRouter.get('/lastTodosDate/:year/:month/:day', [auth], todosAtDate);

module.exports = todoRouter;