const User = require('../Model/User');
const isTokenValid = require('./Util/isTokenValid');

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
