const express = require("express");
const orderItemRouter = express.Router();
const auth = require('../utils/auth.js');

const Orderitem = require("../models/orderitem.js");

orderItemRouter.get("/", auth.verify, auth.verifyAdmin, (req, res) => {

    Orderitem.find({}).then(result => {
        res.send(result);
    })
    
})





module.exports = orderItemRouter;