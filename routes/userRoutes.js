const express = require("express");
const userRouter = express.Router();
const auth = require('../utils/auth.js');

const userController = require('../controllers/userController.js');

userRouter.post('/register', userController.checkDuplicateEmail, userController.register);

userRouter.post('/registeradmin', auth.verify, auth.verifySuperAdmin, userController.checkDuplicateEmail, userController.registerAdmin);

userRouter.post('/login', userController.login);

userRouter.get('/all', auth.verify, auth.verifySuperAdmin, userController.getAll)



userRouter.post('/cart', auth.verify,auth.verifyNotAdmin, auth.getUserIdFromToken, userController.addToCart/* , userController.updateCartValue */);

userRouter.delete('/cart/:id', auth.verify,auth.verifyNotAdmin,auth.getUserIdFromToken, userController.removeFromCart/* , userController.updateCartValue */);

userRouter.patch('/cart/:id', auth.verify,auth.verifyNotAdmin,auth.getUserIdFromToken, userController.updateCartItem/* , userController.updateCartValue */);

userRouter.post('/cart/checkout',auth.verify, auth.verifyNotAdmin,auth.getUserIdFromToken, userController.checkout)

userRouter.get('/orders', auth.verify,auth.verifyNotAdmin,auth.getUserIdFromToken, userController.getUserOrders);

// userRouter.get('/cart', auth.verify, auth.verifyNotAdmin, auth.getUserIdFromToken, userController.getCartValue);


userRouter.get('/',auth.verify,auth.getUserIdFromToken, userController.getDetails);

userRouter.patch('/:id',auth.verify, auth.verifySuperAdmin, userController.adminToggle);

userRouter.post('/auth', auth.isUserLoggedIn);

userRouter.post('/logout', auth.logout);

userRouter.get("/details", auth.verify, userController.getProfile);

userRouter.get('/:id',auth.verify,auth.getUserIdFromToken, userController.getDetailsUsingApp);




module.exports = userRouter;