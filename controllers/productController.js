const Product = require("../models/product.js");



module.exports.createProduct = (req, res) => {
    const {name, description, price, stock, isActive} = req.body;

    if (!name || !description || !price || stock.length == 0) {
        return res.status(400).send('Missing product information.');;
    }
    
    console.log(req.body)

    let newProduct = new Product({
        name: name,
        description: description,
        price: price,
        stock: stock,
        isActive
    });

    return newProduct.save().then((product, err) => {
        if (err) {
            return res.send({success: false});
        }

        return res.send({success: true, id: product._id});
    })
    

}



module.exports.getAllProducts = (req, res) => {
    return Product.find({isActive: true}).then(result => {
        return res.send(result);
    })
}

module.exports.getAllProductsAdmin = (req, res) => {
    return Product.find({}).then(result => {
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
    const {name, description, price, stock, isActive} = req.body;

    if (!name || !description || !price || stock.length == 0) {
        return res.staus(400).send('Missing required details');
    }

    const productUpdates = {
        name: name,
        description: description,
        price: price,
        stock,
        isActive
    }

    return Product.findByIdAndUpdate(productId,productUpdates, (err, foundProduct) => {
        if (err) {
            return res.send({sucess: false});
        }

        return res.send({success: true, id: productId});
        
    })



}

function doActivate(productId,bool) {
    const updateIsActive = {isActive: bool}

    return Product.findByIdAndUpdate(productId, updateIsActive).then((foundProduct, err) => {
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