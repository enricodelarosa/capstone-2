const express = require("express");
const userRouter = express.Router();
// const auth = require('../auth.js');

const userController = require('../controllers/userController.js');

userRouter.post('/register', userController.checkDuplicateEmail, userController.register);

userRouter.post('/login', userController.login);

userRouter.get('/:id', userController.getDetails);



module.exports = userRouter;