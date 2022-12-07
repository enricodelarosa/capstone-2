const Product = require("../models/product.js");



module.exports.createProduct = (req, res) => {
    const {name, description, price} = req.body;

    if (!name || !description || !price) {
        return res.status(400).send('Missing product information.');;
    }
    
    console.log(req.body)

    let newProduct = new Product({
        name: name,
        description: description,
        price: price
    });

    return newProduct.save().then((product, err) => {
        if (err) {
            return res.send(false);
        }

        return res.send(true);
    })
    

}


// Only get the active ones
module.exports.getAllProducts = (req, res) => {
    return Product.find({isActive: true}).then(result => {
        return res.send(result);
    })
}

module.exports.getProductById = (req, res) => {
    const productId = req.params.id; 

    return Product.findById(productId).then(result => {
        return res.send(result);
    })
}

module.exports.updateProduct = (req, res) => {
    const productId = req.params.id; 
    const {name, description, price} = req.body;

    if (!name || !description || !price) {
        return res.staus(400).send('Missing required details');
    }

    const productUpdates = {
        name: name,
        description: description,
        price: price
    }

    return Product.findByIdAndUpdate(productId,productUpdates, (err, foundProduct) => {
        if (err) {
            return res.send(false);
        }

        return res.send(productUpdates);
        
    })



}

function doActivate(productId,bool) {
    const updateIsActive = {isActive: bool}

    return Product.findByIdAndUpdate(productId, updateIsActive).then((updatedProduct, err) => {
        if (err) {
            return false;
        }

        return updateIsActive;
    })

}

module.exports.activate = async (req, res) => {
    const productId = req.params.id;
    
    const result = await doActivate(productId, true);

    return res.send(result);

}

module.exports.deactivate = async (req, res) => {
    const productId = req.params.id;

    const result = await doActivate(productId, false);

    return res.send(result);
}