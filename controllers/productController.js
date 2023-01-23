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

    console.log(req.query);
    let sortField = req.query.field;
    let isAsc = Number(req.query.isAsc);

    if (typeof sortField == 'undefined') {
        sortField = 'name';
    
    }

    if (typeof isAsc == 'undefined') {
        sortBy = 1;
    }

    const sortObj = {[sortField]: isAsc}

    console.log(sortObj)

    return Product.find({isActive: true}).sort(sortObj).then(result => {
        return res.send(result);
    })
}

module.exports.getAllProductsAdmin = (req, res) => {

    console.log(req.query);
    let sortField = req.query.field;
    let isAsc = Number(req.query.isAsc);

    if (typeof sortField == 'undefined') {
        sortField = 'name';
    
    }

    if (typeof isAsc == 'undefined') {
        sortBy = 1;
    }

    const sortObj = {[sortField]: isAsc}

    console.log(sortObj);

    return Product.find({}).sort(sortObj).then(result => {
        return res.send(result);
    })
}

module.exports.getProductById = async (req, res) => {
    const productId = req.params.id; 

    console.log(req.query);
    let sortField = req.query.field;
    let isAsc = Number(req.query.isAsc);

    if (typeof sortField == 'undefined') {
        sortField = 'name';
    
    }

    if (typeof isAsc == 'undefined') {
        sortBy = 1;
    }

    const sortObj = {[sortField]: isAsc}

    const mapper = await Product.find({isActive: true}, '_id').sort(sortObj).then(result => {
        //console.log(map);
        const mapper = result.map(obj => {
            return String(obj._id);
        })

        return mapper;
    })

    return Product.findById(productId).then(result => { 
        const prodIndex = mapper.indexOf(productId);

        console.log(prodIndex);
        return res.send({
            product: result, 
            productIdBefore: mapper[Number(prodIndex) - 1],
            productIdAfter: mapper[Number(prodIndex + 1)]});
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