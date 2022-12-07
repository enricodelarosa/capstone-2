const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = require('./auth.js')

const secret = process.env.APP_SECRET_KEY;

module.exports.createAccessToken = user => {
	// payload
	const data = {
		userId: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}

	return jwt.sign(data, secret, {expiresIn:'2d'});
}


module.exports.verify = (req, res, next) => {

    //GEt JWT (JSON Web Token) from postman 

    let token = req.cookies.token || '';

    if (!token) {
        return res.send('Please log-in to perform operation.')
    }

    if (typeof token !== "undefined ") {
        //console.log(token);


        return jwt.verify(token, secret, (error, data) => {
            if (error) {
                return res.send({auth: "Failed"});
            } else {
                req.body.user = {
                    userId: data.userId,
                    isAdmin: data.isAdmin
                }

                next();
            }
        });

    } else {
        return null;
    }

}

// To decode the user details from the token
module.exports.decode = token => {
    // if (typeof token !== "undefined") {
    //     // remove first 7 characters (Bearer) from the token
    //     token = token.slice(7,token.length);

    // }

    return jwt.verify(token, secret, (error, data) => {
        if (error) {
            return null;
        } else {
            return jwt.decode(token, {complete: true}).payload;
        }
    });
}



module.exports.verifyAdmin = (req, res, next) => {
    const isAdmin = req.body.user.isAdmin

    if (!isAdmin) {
        return res.send('User must be ADMIN to access this.');
    }

    // req.body.newData = newData;

    next();

}



module.exports.getUserIdFromToken = (req, res, next) => {
    const userId = req.body.user.userId

    req.body.userIdFromToken = userId;

    next();

}





