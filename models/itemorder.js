const mongoose = require('mongoose');

const itemorderSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: [true, 'Product Id is required']
    },
    orderId: {
        type: String,
        required: [true, 'Order Id is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required']
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit Price is required']
    },
    subTotal: {
        type: Number,
        required: [true, 'subTotal is required']
    }


})



// Model name      //Schema name
module.exports = mongoose.model("Itemorder", itemorderSchema);