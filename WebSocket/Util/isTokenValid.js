const jwt = require('jsonwebtoken');

function isTokenValid({ token, email, _id }) {
    let isTokenValid;
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        if (decoded.email !== email || decoded._id !== _id) {
            isTokenValid = false;
            return isTokenValid;
        }
        isTokenValid = true;
        return isTokenValid;
    } catch (e) {
        isTokenValid = false;
        return isTokenValid;
    }
}

module.exports = isTokenValid;
