const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.APP_SECRET_KEY;

module.exports.createAccessToken = user => {
	// payload
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}

	return jwt.sign(data, secret, {});
}


module.exports.verify = (req, res, next) => {

    //GEt JWT (JSON Web Token) from postman 

    if (!req.headers.authorization) {
        return res.send('Please log-in.')
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



