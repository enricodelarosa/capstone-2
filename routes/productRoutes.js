const express = require("express");
const productRouter = express.Router();
const auth = require('../utils/auth.js');

const productController = require('../controllers/productController.js')

productRouter.post('/', productController.createProduct)


module.exports = productRouter;