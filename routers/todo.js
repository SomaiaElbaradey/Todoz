const express = require('express');
const todoRouter = new express.Router()
const auth = require("../middlewares/auth");
const admin  = require("../middlewares/admin");

const { addRouter } = require('../controllers/todo')

todoRouter.post('/add', [auth, admin], addRouter);

module.exports = todoRouter;