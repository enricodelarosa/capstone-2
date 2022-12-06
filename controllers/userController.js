const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const auth = require('../utils/auth.js');

// Untested
module.exports.verifyAdmin = (req, res, next) => {
    const isAdmin = auth.decode(req.headers.authorization).isAdmin


    if (!isAdmin) {
        return res.send('User must be ADMIN to access this.');
    }

    // req.body.newData = newData;

    next();

}

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