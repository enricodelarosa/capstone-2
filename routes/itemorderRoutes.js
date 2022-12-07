const express = require("express");
const itemorderRouter = express.Router();
const auth = require('../utils/auth.js');

const Itemorder = require("../models/itemorder.js");

itemorderRouter.get("/", auth.verify, auth.verifyAdmin, (req, res) => {

    Itemorder.find({}).then(result => {
        res.send(result);
    })
    
})





module.exports = itemorderRouter;