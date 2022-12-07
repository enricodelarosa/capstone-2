const express = require("express");
const orderRouter = express.Router();
const auth = require('../utils/auth.js');

const Order = require("../models/order.js");

orderRouter.get("/", auth.verify, auth.verifyAdmin, (req, res) => {

    Order.find({}).then(result => {
        res.send(result);
    })

})





module.exports = orderRouter;