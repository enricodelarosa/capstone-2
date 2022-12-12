const express = require("express");
const userRouter = express.Router();
const auth = require('../utils/auth.js');

const userController = require('../controllers/userController.js');

userRouter.post('/register', userController.checkDuplicateEmail, userController.register);

userRouter.post('/login', userController.login);



userRouter.post('/cart', auth.verify,auth.verifyNotAdmin, auth.getUserIdFromToken, userController.addToCart, userController.updateCartValue);

userRouter.delete('/cart/:id', auth.verify,auth.verifyNotAdmin,auth.getUserIdFromToken, userController.removeFromCart, userController.updateCartValue);

userRouter.patch('/cart/:id', auth.verify,auth.verifyNotAdmin,auth.getUserIdFromToken, userController.updateCartItem, userController.updateCartValue);

userRouter.post('/cart/checkout', auth.verifyNotAdmin,auth.verify,auth.getUserIdFromToken, userController.checkout)

userRouter.get('/orders', auth.verify,auth.getUserIdFromToken, userController.getUserOrders);


userRouter.get('/:id', userController.getDetails);

userRouter.patch('/:id',auth.verify, auth.verifyAdmin, userController.adminToggle);

userRouter.post('/auth', auth.isUserLoggedIn);

userRouter.post('/logout', auth.logout);


module.exports = userRouter;