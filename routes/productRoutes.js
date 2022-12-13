const express = require("express");
const productRouter = express.Router();
const auth = require('../utils/auth.js');

const productController = require('../controllers/productController.js')

productRouter.post('/', auth.verify,auth.verifyAdmin, productController.createProduct)



productRouter.get('/', productController.getAllProducts)

productRouter.get('/all',auth.verify,auth.verifyAdmin, productController.getAllProductsAdmin)


productRouter.get('/:id', productController.getProductById)

productRouter.put('/:id', auth.verify,auth.verifyAdmin, productController.updateProduct)

productRouter.patch('/:id/activate', auth.verify,auth.verifyAdmin, productController.activate)

productRouter.patch('/:id/deactivate', auth.verify,auth.verifyAdmin, productController.deactivate)





module.exports = productRouter;