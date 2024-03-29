const User = require("../models/user.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const Orderitem = require("../models/orderitem.js");
const bcrypt = require("bcrypt");
const auth = require('../utils/auth.js');


// Untested


module.exports.register = (req ,res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).send('Missing registration detail');
    }

	let newUser = new User({
		email: email,
		password: bcrypt.hashSync(password, 10),
		// isAdmin: isAdmin,
        // Only superadmin can add admins
		// bcrypt  package for password hasing
		// hashSync - syncronously generate a hash
		// hash - asynchronously generate a hash
	});

	return newUser.save().then((user, error) => {
		if (error) {
			return res.status(400).send(false);
		} else {
			return res.status(200).send(true);
		}
	})

    

}

module.exports.registerAdmin = (req, res) => {

    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).send('Missing registration detail');
    }

	let newUser = new User({
		email: email,
		password: bcrypt.hashSync(password, 10),
		isAdmin: true,
        // Only superadmin can add admins
		// bcrypt  package for password hasing
		// hashSync - syncronously generate a hash
		// hash - asynchronously generate a hash
	});

	return newUser.save().then((user, error) => {
		if (error) {
			return res.status(400).send(false);
		} else {
			return res.status(200).send(true);
		}
	})

}

module.exports.checkDuplicateEmail = (req, res, next) => {
    return User.find({email: req.body.email}).then(result => {
		if (result.length > 0) {
			return res.send(false);
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
            return res.status(400).send(false);
        }

        // const expiration = 172800000; //2 days
        const token = auth.createAccessToken(result);
        // const cookie =  res.cookie('token',token, {
        //     expires: new Date(Date.now() + expiration),
        //     secure: false, //set to ture if using https,
        //     httpOnly: true
        // })



        return res.status(200).send({access: token});
    })
}

module.exports.getDetails = (req, res) => {
    const userId = req.body.userIdFromToken;

    console.log(userId);
    console.log(userId == 'null')
    
    if (userId == 'null') {
        return res.status(400).send(false);
    }

    

    return User.findById(userId).then(result => {
        result.password = '';
        
        return res.send(result);
    })
}

module.exports.getDetailsUsingApp = (req, res) => {
    const userId = req.params.id;

    console.log(userId);
    console.log(userId == 'null')
    
    if (userId == 'null') {
        return res.status(400).send(false);
    }

    

    return User.findById(userId).then(result => {
        result.password = '';
        
        return res.send(result);
    })
}

module.exports.addToCart = async (req, res, next) => {

    console.log('hit add to cart route')
    //get unit price from product table
    const userId = req.body.userIdFromToken;

    console.log('userId',userId);

    const {productId, quantity} = req.body;

    console.log(req.body);

    console.log(req.body.productId);
    console.log(req.body.quantity);

    // const {name, unitPrice} = await Product.findById(productId).then(product => {
    //     return {
    //         unitPrice: product.price,
    //         name: product.name
    //     };
    // })

    // if (!unitPrice) {
    //     return res.send('Product Id does not exit');
    // } 

    if (Number(quantity) <= 0) {
        return res.send({success: false, error: "Cart cannot be negative number or 0"});
    }
    
     if (!productId || String(quantity).length == 0) {
        return res.send({success: false, error: "Missing field of item order"});
    } 

    const addToCart = {
        // name: name,
        productId: productId,
        quantity: quantity,
        // unitPrice: unitPrice,
        // subTotal: quantity * unitPrice
    }


    return User.findById(userId).then(user => {
 
        const isAlreadyInCart = user.cart.find(orderitem => {
            return orderitem.productId == productId;
        })

        if (isAlreadyInCart) {
            return res.status(400).send({success: false, error: "Item already in cart"});
        }



        user.cart.push(addToCart);

        return user.save().then((user, err) => {
            if (err) {
                return res.send(false);
            }

            return res.send({success: true})
            
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

        // We could make this more complicated and check if this productId exits in the cart but not super necessary as this is removal

        return user.save().then((user, err) => {
            if (err) {
                return res.status(400).send({success: false});
            }

            return res.send({success: true})
            
        })

    })

}

module.exports.updateCartItem = async (req, res, next) => {

    console.log('hit update cart route')
    const userId = req.body.userIdFromToken;
    const productId = req.params.id;

    const quantity = req.query.quantity;

    if (quantity <= 0) {
        return res.status(400).send({success: false, error: 'quantity cannot be less than or equal to zero.'})
    }

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
            // "cart.$.unitPrice": unitPrice,
            // "cart.$.subTotal": quantity * unitPrice
        }
    }).then((returnObj, err) => {
        
        if (err) {
            return res.status(500).send({success: false});
        }


        if (!returnObj.acknowledged) {
            return res.status(400).send({success: false});
        }


        return res.send({success: true});
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

        res.status(200).send({success: true});
    })

}

module.exports.checkout = async(req, res) => {
    const userId = req.body.userIdFromToken;

    console.log(userId);

    const cartArray = await User.findById(userId).then(user => {
        return user.cart;
    })

    let newCart = [];

    for (let cartItem of cartArray) {
        newCart.push(
            Product.findById(cartItem.productId).then(result => {

            const objToPush = {
                productId : result._id,
                name: result.name,
                quantity: cartItem.quantity,
                unitPrice: result.price,
                subTotal: cartItem.quantity * result.price
            }

            return objToPush
            })
        )

    }

    let cartValue = 0;
    console.log(newCart);

    const finalCart = await Promise.all(newCart).then(values => {
        const computedCartValue = values.reduce((total,orderItem) => {
            return total + Number(orderItem.subTotal);
            
    
        }, 0)

        cartValue = computedCartValue;
        
        return values;
    })

    console.log(cartValue);
    console.log(finalCart);




    if (cartValue === 0 || finalCart.length == 0) {
        return res.status(400).send({success: false, errorHeading: 'No items in cart.', errorMessage: "Please add an item to your cart before checking out."})
    }

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
        return res.status(500).send({success: false, error:'Error saving order, try again'});
    }

    let didOrderItemError = false;
    const orderItemPromises = finalCart.map(orderitem => {
        const {productId,name, quantity, unitPrice, subTotal} = orderitem

        const newOrderItem = new Orderitem({
            name, name,
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
            res.status(500).send({success: false, error:'Error when saving item orders'})
        }

        User.findByIdAndUpdate(userId, {
            cartValue: 0,
            cart: []
        }).then((foundUser, err) => {
            if (err) {
                return res.status(500).send({success: false, error:'Error when saving item orders'});
            }

            res.status(200).send({success: true, orderId: orderId});
        })
    })

    // Push cart items to orderitem
    // push order number to order


}

module.exports.getUserOrders = async (req, res) => {

    const userId = req.body.userIdFromToken;

    const orders = await Order.find({userId: userId}).sort('-purchasedOn').then(result => {
        return result
    })

    

    const orderItems = await orders.map(order => {
        console.log(order);
        const orderId = String(order._id);
        console.log(orderId);
        return Orderitem.find({orderId: orderId}).then((foundOrderItem, err) => {
            
            const {totalAmount, purchasedOn} = order;
            joinedOrder = {
                orderId: orderId,
                totalAmount: totalAmount,
                purchasedOn: purchasedOn,
                orderItems: foundOrderItem
            }
            return joinedOrder
        });
    })

    return Promise.all(orderItems).then(orderItemsArray => {
        return res.send(orderItemsArray);
    })


}

module.exports.adminToggle = (req, res) => {
    const targetUserId = req.params.id;
    const isAdmin = req.query.isAdmin;

    if (typeof isAdmin == 'undefined') {
        return res.status(400).send('No query sent');
    }

    return User.findByIdAndUpdate(targetUserId, {isAdmin: isAdmin}).then((foundUser, err) => {
        if (err) {
            return res.send(false);
        }

        res.send({isAdmin: isAdmin});
    })

}

module.exports.getProfile = async (req, res) => {
    // const userData = auth.decode(req.headers.authorization);

    // console.log(userData); 

    // console.log(req.headers.authorization);

    const activeProducts = await Product.find({isActive: true}).then(result => {
        return result.map(product => {
            return String(product._id);
        })
    })

    const user = await User.findById(req.body.user.userId).then(result => {
        //console.log(result);

        if (result == null) {
            return false;
        } else {
            result.password = "*****"


            return result;
        }
    });


    const newCart = [];

    for (let cartItem of user.cart) {
        newCart.push(Product.findById(cartItem.productId).then(result => {

            let isFound = activeProducts.find(activeProduct => {
                console.log(activeProduct);
                console.log(cartItem);
                return activeProduct === cartItem.productId;
           }) 

           if (typeof isFound == 'undefined') {
                isFound = false;
           } else {
            isFound = true;
           }

            const objToPush = {
                productId : result._id,
                name: result.name,
                quantity: cartItem.quantity,
                price: result.price,
                subTotal: cartItem.quantity * result.price,
                isActive: isFound
            }

            return objToPush
        }))

    }


    return Promise.all(newCart).then(values => {
        const cartValue = values.reduce((total,orderItem) => {
            if (!orderItem.isActive) {
                return total;
            }

            return total + Number(orderItem.subTotal);
            
    
        }, 0)
        
        const newUser = {
            ...user._doc,
            cart: values,
            cartValue
        }
        console.log(newUser);
        return res.send(newUser)
    })


}

module.exports.getAll = (req, res) => {

    return User.find({isSuperAdmin: false}, '_id email isAdmin').then(result => {
        res.send(result);
    })
}