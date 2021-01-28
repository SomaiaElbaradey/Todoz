const express = require('express');
const userRouter = new express.Router()

const { userLogin, userRegister } = require('../controllers/user')

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);

module.exports = userRouter;