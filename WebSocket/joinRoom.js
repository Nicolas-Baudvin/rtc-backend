const isTokenValid = require('./Util/isTokenValid');
const Room = require('../Model/Room');
const errors = require('./Util/errors');
const bcrypt = require('bcrypt');

async function isPasswordValid(password, roomPass) {
    return await bcrypt.compare(password, roomPass);
}

async function getRoom(name) {
    return Room.findOne({
        name,
    });
}

function isUserAlreadyMember(email, members) {
    return Boolean(members.find((member) => member.email === email));
}

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
        const room = await getRoom(data.room.name);
        if (!room) {
            return socket.emit('join error', {
                error: errors(data).notfound,
            });
        }

        if (!isUserAlreadyMember(data.email, room.members)) {
            if (!(await isPasswordValid(data.room.password, room.password))) {
                return socket.emit('join error', {
                    error: 'Le mot de passe est invalide',
                });
            } else {
                room.members.push({
                    email: data.email,
                    _id: data._id,
                    socketID: socket.id,
                    username: data.username,
                    picture: data.picture,
                });
                socket.join(data.room.name);
            }
        } else {
            socket.join(data.room.name);
        }

        await room.save();

        return socket.emit('room joined', { room, success: true });
    } catch (e) {
        console.log('server error join room : ', e);
        return socket.emit('join error', { error: e });
    }
}

module.exports = joinRoom;
