const auth = require('../utils/auth.js')

function getUserIdFromToken(req, res, next) {
    const userId = auth.decode(req.headers.authorization).id

    req.body.userIdFromToken = userId;

    next();

}

module.exports = getUserIdFromToken;