const Room = require('../Model/Room');
const isTokenValid = require('./Util/isTokenValid');
const bcrypt = require('bcrypt');

async function createRoom(socket, data) {
    if (!isTokenValid(data)) {
        return socket.emit('failed authentication', {
            error: 'Vous ne pouvez accéder à cette fonctionnalité, reconnectez vous.',
        });
    }

    const { roomName, email, username, _id, password } = data;
    if (!roomName) {
        return socket.emit('create error', {
            error: 'Le nom est obligatoire !',
        });
    }
    if (!password) {
        return socket.emit('create error', {
            error: 'Le mot de passe est obligatoire !',
        });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const room = new Room({
            name: roomName,
            owner: { email, _id, username },
            members: [{ email, _id, username, socketID: socket.id }],
            messages: [],
            password: hash,
        });

        await room.save();

        socket.join(roomName);

        return socket.emit('room created', { success: true, room });
    } catch (e) {
        console.log('error : ', e);
        return socket.emit('create error', {
            error: 'Le serveur a rencontré un problème',
        });
    }
}

module.exports = createRoom;
