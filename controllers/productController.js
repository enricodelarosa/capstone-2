const Product = require("../models/product.js");
const auth = require('../utils/auth.js');


module.exports.createProduct = (req, res) => {
    const {name, description, price} = req.body;

    if (!name || !description || !price) {
        return res.status(400).send('Missing product information.');;
    }
    

    let newProduct = new Product({
        name: name,
        descrpition: description,
        price: price
    });

    return newProduct.save().then((product, err) => {
        if (err) {
            return res.send(false);
        }

        return res.send(true);
    })




    

}