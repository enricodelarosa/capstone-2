const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = require('./auth.js')

const secret = process.env.APP_SECRET_KEY;

module.exports.createAccessToken = user => {
	// payload
	const data = {
		userId: user._id,
		email: user.email,
		isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin
	}

	return jwt.sign(data, secret, {expiresIn:'2d'});
}


module.exports.verify = (req, res, next) => {

    //GEt JWT (JSON Web Token) from postman 

    // let token = req.cookies.token || '';

    // let token = req.headers.authorization.split(' ')[1].split('.')[1];

    if (req.headers.authorization == null) {
        return res.send({auth: "Failed. No Authorization Header."});
    } 

    let token = req.headers.authorization.split(' ')[1];


    //console.log(token);


    if (token == '') {
        return res.send({success: false, loginRequired: true})
    }

    return jwt.verify(token, secret, (error, data) => {
        if (error) {
                return res.send({auth: "Failed"});
        } else {
             req.body.user = {
                userId: data.userId,
                isAdmin: data.isAdmin,
                isSuperAdmin: data.isSuperAdmin
            }

            //console.log('success');

             next();
        }
    });

}

module.exports.verifySuperAdmin = (req, res, next) => {

    const isSuperAdmin = req.body.user.isSuperAdmin

    if (!isSuperAdmin) {
        return res.send('User must be Super Admin to access this.');
    }

    // req.body.newData = newData;

    next();


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

module.exports.verifyNotAdmin = (req, res, next) => {
    const isAdmin = req.body.user.isAdmin;

    if (isAdmin) {
        return res.send({success: false, error: 'User must be non-admin to use cart and place orders.'});
    }

    // req.body.newData = newData;

    next();

}



module.exports.getUserIdFromToken = (req, res, next) => {
    const userId = req.body.user.userId

    req.body.userIdFromToken = userId;

    next();

}

module.exports.isUserLoggedIn = (req, res, next) => {
    let token = req.cookies.token || '';

    if (token.length <= 0) {
        return res.send({LoggedIn : false})
    }

    return jwt.verify(token, secret, (error, data) => {
        if (error) {
            return res.send({LoggedIn : false});
        } 

        console.log(token);

        const payload = jwt.decode(token, {complete: true}).payload;

        return res.send({LoggedIn : true, user: payload})
    


    });
}

module.exports.logout = (req, res, next) => {
    const cokkie = res.cookie('token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        secure: false, //set to ture if using https,
        httpOnly: true,
    })

    res.status(200).send({success: true});
}





