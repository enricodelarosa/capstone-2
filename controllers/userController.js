const User = require("../models/user.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const Orderitem = require("../models/orderitem.js");
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

module.exports.addToCart = async (req, res, next) => {

    //get unit price from product table
    const userId = req.body.userIdFromToken;
    const {productId, quantity} = req.body;

    const unitPrice = await Product.findById(productId).then(product => {
        return product.price;
    })

    if (!unitPrice) {
        return res.send('Product Id does not exit');
    } 

    
    if (!productId || !quantity) {
        return res.send("Missing field of item order");
    } 

    const addToCart = {
        productId: productId,
        quantity: quantity,
        unitPrice: unitPrice,
        subTotal: quantity * unitPrice
    }


    return User.findById(userId).then(user => {
 
        const isAlreadyInCart = user.cart.find(orderitem => {
            return orderitem.productId == productId;
        })

        if (isAlreadyInCart) {
            return res.send("Item already in cart");
        }



        user.cart.push(addToCart);

        return user.save().then((user, err) => {
            if (err) {
                return res.send(false);
            }

            next();
            
        })
    })




}


// Edit product quantity in cart
// involves array.find on the cart array; props a mongoose shortcut for that


module.exports.removeFromCart = (req, res, next) => {

    const userId = req.body.userIdFromToken;
    const productId = req.params.id;

    

    return User.findById(userId).then(user => {
        
        user.cart.pull({productId: productId});

        return user.save().then((user, err) => {
            if (err) {
                return res.send(false);
            }

            next();
            
        })

    })

}

module.exports.updateCartItem = async (req, res, next) => {
    const userId = req.body.userIdFromToken;
    const productId = req.params.id;

    const quantity = req.query.quantity;

    const unitPrice = await Product.findById(productId).then(product => {
        return product.price;
    })

    if (!unitPrice) {
        return res.send('Product Id does not exit');
    } 

    
    if (!productId || !quantity) {
        return res.send("Missing field of item order");
    } 

    return User.updateOne(
        {_id: userId,"cart.productId": productId},
        {$set: {
            "cart.$.quantity": quantity,
            "cart.$.unitPrice": unitPrice,
            "cart.$.subTotal": quantity * unitPrice
        }
    }).then((foundUser, err) => {
        if (err) {
            return res.send(false);
        }


        next();
    })

}





module.exports.updateCartValue = async (req, res)=> {

    const userId = req.body.userIdFromToken;

    const cartArray = await User.findById(userId).then(user => {
        return user.cart;
    })

    const newCartValue = cartArray.reduce((total,orderItem) => {
        return total + Number(orderItem.subTotal);
        

    }, 0)

    console.log(newCartValue);


    const result = await User.findByIdAndUpdate(userId, {cartValue: newCartValue}).then((foundUser, err) => {
        if (err) {
            return res.send(false);
        }

        res.send(true);
    })

}

module.exports.checkout = async(req, res) => {
    const userId = req.body.userIdFromToken;

    const [cartArray, cartValue]  = await User.findById(userId).then(user => {
        return [user.cart, user.cartValue];
    })

    const newOrder = new Order({
        userId: userId,
        totalAmount: cartValue,
    })

    const orderId = await newOrder.save().then((newOrder, err) => {
        if (err) {
            return false
        }

        console.log(newOrder)

        const id = String(newOrder._id);
        return id;


    })

    console.log(orderId);

    if (!orderId) {
        return res.send('Error saving order, try again');
    }

    let didOrderItemError = false;
    const orderItemPromises = cartArray.map(orderitem => {
        const {productId, quantity, unitPrice, subTotal} = orderitem

        const newOrderItem = new Orderitem({
            orderId: orderId, 
            productId: productId,
            quantity: quantity,
            unitPrice: unitPrice,
            subTotal: subTotal
        });

        return newOrderItem.save().then((orderitem, err) =>{
            if (err) {
                didOrderItemError = true;
            }
        })

    })
    


    return Promise.all(orderItemPromises).then(values => {
        if (didOrderItemError) {
            res.send('Error when saving item orders')
        }

        User.findByIdAndUpdate(userId, {
            cartValue: 0,
            cart: []
        }).then((foundUser, err) => {
            if (err) {
                return res.send(err);
            }

            res.send(true);
        })
    })

    // Push cart items to orderitem
    // push order number to order


}

module.exports.getUserOrders = async (req, res) => {

    const userId = req.body.userIdFromToken;

    const orders = await Order.find({userId: userId}).then(result => {
        return res.send(result);
    })

    const orderItems = await orders.map(order => {
        return 
    })


    // The orderitems table was created so that items can be shipped separately especially if they're from different sellers.

    // To get orderitems, we use all orderids returned by the request and we create an array with objects that have the following properties:
    // 1. OrderId
    // 2. orderitems
    // 3. CreatedOn
    // 4. TotalAmount
    /*
        Ex. [{
            OrderId: 1,
            orderitems: [{}, {}, {}],
            totalAmount: 2343.00
            createdOn: sample date
        },
        {
            OrderId: 2
        }
        ]
    */
        
}
