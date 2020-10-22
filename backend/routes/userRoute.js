const express = require('express');
const userRouter = express.Router();
const userContrller = require('../controllers/userController')


userRouter.post('/signup', userContrller.userSignup)

userRouter.post('/login', userContrller.userLogin)
module.exports = userRouter;
