const express = require("express");
const orderRouter = express.Router();
const auth = require('../utils/auth.js');

const Order = require("../models/order.js");
const Orderitem = require("../models/orderitem.js");

const User = require("../models/user");

orderRouter.get("/", auth.verify, auth.verifyAdmin, async function(req, res) {
    const isDetailed = req.query.isDetailed;
    
    
    if (!isDetailed) {
        return Order.find({}).then(result => {
            const uniqueUsers = [];


        for (let order of result) {

            const isInArray = uniqueUsers.find(uniqueUser => {
                return uniqueUser.userId === order.userId
            })

            if (!isInArray) {
                
                uniqueUsers.push({
                    userId: order.userId,
                    orders: []
                })
            }
        }

        //console.log(uniqueUsers);

        for (let i in uniqueUsers) {
            const uniqueUser = uniqueUsers[i];

            for (let order of result) {

                const myOrder = order.userId === uniqueUser.userId

                if (myOrder) {

                    uniqueUser.orders.push(order)
                }
            }

        }

        let finalArray = []

        for (let i in uniqueUsers) {
            const uniqueUser = uniqueUsers[i];


            finalArray.push(User.findById(uniqueUser.userId).then(result => {
                return  result.email;
            }))
        }


        

       return Promise.all(finalArray).then(emailArray => {
            let finalFinalArray = [];
            for (let i in emailArray) {
                const email = emailArray[i];

                const userObj = uniqueUsers[i];

                userObj.email = email;

                finalFinalArray.push(userObj)

            }


            res.send(finalFinalArray);

        })


            res.send(uniqueUsers);
        })
    }

    const orders = await Order.find({}).then(result => {
        return result
    })

    //console.log(orders);
    

    const orderItems = await orders.map(order => {
        
        //console.log(order);
        const orderId = String(order._id);
        //console.log(orderId);

        return Orderitem.find({orderId: orderId}).then((foundOrderItem, err) => {
            
            const {totalAmount, purchasedOn} = order;
            joinedOrder = {
                userId: order.userId,
                orderId: orderId,
                totalAmount: totalAmount,
                purchasedOn: purchasedOn,
                orderItems: foundOrderItem
            }
            return joinedOrder
        });
    })

    return Promise.all(orderItems).then(orderItemsArray => {

        const uniqueUsers = [];


        for (let order of orderItemsArray) {

            const isInArray = uniqueUsers.find(uniqueUser => {
                return uniqueUser.userId === order.userId
            })

            if (!isInArray) {
                uniqueUsers.push({
                    userId: order.userId,
                    orders: []
                })
            }
        }

        //console.log(uniqueUsers);

        for (let i in uniqueUsers) {
            const uniqueUser = uniqueUsers[i];

            for (let order of orderItemsArray) {

                const myOrder = order.userId === uniqueUser.userId

                if (myOrder) {

                    uniqueUser.orders.push(order)
                }
            }

        }
        
        let finalArray = []

        for (let i in uniqueUsers) {
            const uniqueUser = uniqueUsers[i];


            finalArray.push(User.findById(uniqueUser.userId).then(result => {
                return  result.email;
            }))
        }


        

       return Promise.all(finalArray).then(emailArray => {
            let finalFinalArray = [];
            for (let i in emailArray) {
                const email = emailArray[i];

                const userObj = uniqueUsers[i];

                userObj.email = email;

                finalFinalArray.push(userObj)

            }


            res.send(finalFinalArray);

        })

        return res.send(uniqueUsers);
    })

})





module.exports = orderRouter;