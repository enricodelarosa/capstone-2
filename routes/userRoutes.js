const express = require("express");
const userRouter = express.Router();
const auth = require('../utils/auth.js');
const getUserIdFromToken = require('./getUserIdFromToken.js')

const userController = require('../controllers/userController.js');

userRouter.post('/register', userController.checkDuplicateEmail, userController.register);

userRouter.post('/login', userController.login);

userRouter.post('/addToCart', auth.verify,getUserIdFromToken, userController.addToCart);

userRouter.get('/:id', userController.getDetails);



module.exports = userRouter;