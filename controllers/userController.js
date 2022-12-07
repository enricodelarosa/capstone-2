const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const auth = require('../utils/auth.js');

// Untested


module.exports.register = (req ,res) => {
    const {email, password, isAdmin,cart} = req.body

    if (!email || !password) {
        return res.status(400).send('Missing registration detail');
    }

	let newUser = new User({
		email: email,
		password: bcrypt.hashSync(password, 10),
		isAdmin: isAdmin,
		// bcrypt  package for password hasing
		// hashSync - syncronously generate a hash
		// hash - asynchronously generate a hash
	});

	return newUser.save().then((user, error) => {
		if (error) {
			return res.send(false);
		} else {
			return res.send(true);
		}
	})

    

}

module.exports.checkDuplicateEmail = (req, res, next) => {
    return User.find({email: req.body.email}).then(result => {
		if (result.length > 0) {
			return res.send('Email is already registered');
		} else {
			return next();
		}
	});


}

module.exports.login = (req, res) => {
    const {email, password} = req.body;

    return User.findOne({email: email}).then(result => {
        if (!result) {
            return res.send(false);
        }

        const isPasswordCorrect = bcrypt.compareSync(password, result.password);

        if (!isPasswordCorrect) {
            return res.send(false);
        }

        return res.send({access: auth.createAccessToken(result)});
    })
}

module.exports.getDetails = (req, res) => {
    const userId = req.params.id;

    

    return User.findById(userId).then(result => {
        result.password = '';
        
        return res.send(result);
    })
}

module.exports.addToCart = (req, res) => {

    //get unit price from product table
    const userId = req.body.userIdFromToken;
    const {productId, quantity, unitPrice,subTotal} = req.body;


    
    if (!productId || !quantity || ! unitPrice || !subTotal) {
        return res.send("Missing field of item order");
    } 

    const addToCart = {
        productId: productId,
        quantity: quantity,
        unitPrice: ,
        subTotal: quantity * unitPrice
    }


    return User.findById(userId).then(user => {
        user.cart.push(addToCart);

        return user.save().then((user, err) => {
            if (err) {
                return res.send(true);
            }

            return res.send(true);
        })
    })


// Edit product quantity in cart
// involves array.find on the cart array; props a mongoose shortcut for that
// Remove products from cart
// we can probs do a set?
// total price
// This can just be a middle ware
// update cartvalue after every cart modification





}