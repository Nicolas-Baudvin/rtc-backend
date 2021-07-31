const isTokenValid = require('./Util/isTokenValid');
const Room = require('../Model/Room');

const errors = (data) => ({
    auth: 'Vous ne pouvez accéder à cette fonctionnalité, reconnectez vous.',
    noname: "Le champs 'nom du chat' est obligatoire",
    notfound: `Aucun chat avec le nom ${data.room.name} n'existe`,
});

async function joinRoom(socket, data, io) {
    if (!isTokenValid(data)) {
        return socket.emit('failed authentication', {
            error: errors(data).auth,
        });
    }

    if (!data.room.name) {
        return socket.emit('join error', {
            error: errors(data).noname,
        });
    }

    try {
        const room = await Room.findOne({
            name: data.room.name,
            _id: data.room._id,
        });
        if (!room) {
            return socket.emit('join error', {
                error: errors(data).notfound,
            });
        }

        socket.join(data.room.name);
        room.members.push({
            email: data.email,
            _id: data._id,
            socketID: socket.id,
            username: data.username,
        });

        await room.save();

        return socket.emit('room joined', { room, success: true });
    } catch (e) {
        console.log('server error join room : ', e);
        return socket.emit('join error', { error: e });
    }
}

module.exports = joinRoom;
