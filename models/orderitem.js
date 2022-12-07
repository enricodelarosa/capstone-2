const mongoose = require('mongoose');

const orderitemSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: [true, 'Order Id is required']
    },
    productId: {
        type: String,
        required: [true, 'Product Id is required']
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
module.exports = mongoose.model("Orderitem", orderitemSchema);