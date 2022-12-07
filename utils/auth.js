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

	return jwt.sign(data, secret, {});
}


module.exports.verify = (req, res, next) => {

    //GEt JWT (JSON Web Token) from postman 

    if (!req.headers.authorization) {
        return res.send('Please log-in to perform operation.')
    }

    let token = req.headers.authorization

    if (typeof token !== "undefined ") {
        //console.log(token);
        
        // remove first 7 characters (Bearer) from the token
        token = token.slice(7,token.length);

        return jwt.verify(token, secret, (error, data) => {
            if (error) {
                return res.send({auth: "Failed"});
            } else {
                next();
            }
        });

    } else {
        return null;
    }

}

// To decode the user details from the token
module.exports.decode = token => {
    if (typeof token !== "undefined") {
        // remove first 7 characters (Bearer) from the token
        token = token.slice(7,token.length);

    }

    return jwt.verify(token, secret, (error, data) => {
        if (error) {
            return null;
        } else {
            return jwt.decode(token, {complete: true}).payload;
        }
    });
}



module.exports.verifyAdmin = (req, res, next) => {
    const isAdmin = auth.decode(req.headers.authorization).isAdmin

    if (!isAdmin) {
        return res.send('User must be ADMIN to access this.');
    }

    // req.body.newData = newData;

    next();

}



module.exports.getUserIdFromToken = (req, res, next) => {
    const userId = auth.decode(req.headers.authorization).id

    req.body.userIdFromToken = userId;

    next();

}





