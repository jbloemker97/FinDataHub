const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function sign (payload) {
    return jwt.sign(payload, jwtSecret);
}

function verify (token) {
    try {
        return jwt.verify(payload, jwtSecret);
    }catch (error) {
        return false;
    }
}

module.exports = {
    sign,
    verify
};