const express = require("express");
const productRouter = express.Router();
const auth = require('../utils/auth.js');

const verifyAdmin = require('./verifyAdmin.js')

const productController = require('../controllers/productController.js')

productRouter.post('/', auth.verify,verifyAdmin, productController.createProduct)

productRouter.get('/', productController.getAllProducts)


productRouter.get('/:id', productController.getProductById)

productRouter.put('/:id', auth.verify,verifyAdmin, productController.updateProduct)


productRouter.patch('/:id/activate', auth.verify,verifyAdmin, productController.activate)

productRouter.patch('/:id/deactivate', auth.verify,verifyAdmin, productController.deactivate)





module.exports = productRouter;