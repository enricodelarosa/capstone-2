const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'UserId is required']
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total Amount is required']
    },
    purchasedOn: {
        type: Date,
        default: new Date()
    }

})



// Model name      //Schema name
module.exports = mongoose.model("Order", orderSchema);