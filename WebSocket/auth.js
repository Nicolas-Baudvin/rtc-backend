const User = require('../Model/User');
const jwt = require('jsonwebtoken');

function isTokenValid({ token, email, _id }) {
    let isTokenValid;
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        if (decoded.email !== email && decoded._id !== _id) {
            isTokenValid = false;
        }
        isTokenValid = true;
        return isTokenValid;
    } catch (e) {
        isTokenValid = false;
        return isTokenValid;
    }
}

async function socketAuthentication(socket, data) {
    const { email, _id } = data;
    try {
        const user = await User.findOne({ email, _id });
        if (!user || !isTokenValid(data)) {
            return socket.emit('failed authentication', {
                error: 'Vous ne pouvez accéder à cette fonctionnalité, reconnectez vous.',
            });
        }

        user.socketID = socket.id;
        await user.save();

        return socket.emit('success authentication', { success: true, user });
    } catch (e) {
        console.log(e);
        return socket.emit('failed authentication', {
            error: 'Erreur sur le server.',
        });
    }
}

module.exports = socketAuthentication;