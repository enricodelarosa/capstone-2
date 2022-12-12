const express = require("express");
const orderRouter = express.Router();
const auth = require('../utils/auth.js');

const Order = require("../models/order.js");
const Orderitem = require("../models/orderitem.js");

orderRouter.get("/", auth.verify, auth.verifyAdmin, async function(req, res) {
    const isDetailed = req.query.isDetailed;
    
    
    if (!isDetailed) {
        return Order.find({}).then(result => {
            res.send(result);
        })
    }

    const orders = await Order.find({}).then(result => {
        return result
    })

    console.log(orders);
    

    const orderItems = await orders.map(order => {
        
        console.log(order);
        const orderId = String(order._id);
        console.log(orderId);

        return Orderitem.find({}).then((foundOrderItem, err) => {
            
            const {totalAmount, purchasedOn} = order;
            joinedOrder = {
                orderId: orderId,
                totalAmount: totalAmount,
                purchasedOn: purchasedOn,
                orderItems: foundOrderItem
            }
            return joinedOrder
        });
    })

    return Promise.all(orderItems).then(orderItemsArray => {
        return res.send(orderItemsArray);
    })

})





module.exports = orderRouter;