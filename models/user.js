const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    // cartValue: {
    //     type: Number,
    //     default: 0
    // },
    cart: [{
        productId: {
            type: String,
            required: [true, 'Product Id is required']
        },
        // name: { 
        //     type: String,
        //     required: [true, 'Product name is required']
        // },
        quantity: {
            type: Number,
            required: [true, 'Product quantity is required']
        },
        // unitPrice: {
        //     type: Number,
        //     required: [true, 'Unit Price is required']
        // },
        // subTotal: {
        //     type: Number,
        //     required: [true, 'subTotal is required']
        // }
    }]
})



// Model name      //Schema name
module.exports = mongoose.model("User", userSchema);