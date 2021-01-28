const express = require('express');
const todoRouter = new express.Router()

const { addRouter } = require('../controllers/todo')

todoRouter.post('/add', addRouter);

module.exports = todoRouter;