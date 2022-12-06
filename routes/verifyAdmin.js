const auth = require('../utils/auth.js')

function verifyAdmin(req, res, next) {
    const isAdmin = auth.decode(req.headers.authorization).isAdmin

    if (!isAdmin) {
        return res.send('User must be ADMIN to access this.');
    }

    // req.body.newData = newData;

    next();

}

module.exports = verifyAdmin;