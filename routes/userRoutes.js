const express = require("express");
const userRouter = express.Router();
const auth = require('../utils/auth.js');

const userController = require('../controllers/userController.js');

userRouter.post('/register', userController.checkDuplicateEmail, userController.register);

userRouter.post('/login', userController.login);

userRouter.post('/cart', auth.verify,auth.getUserIdFromToken, userController.addToCart);

userRouter.get('/:id', userController.getDetails);



module.exports = userRouter;