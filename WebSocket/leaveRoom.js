const isTokenValid = require('./Util/isTokenValid');
const errors = require('./Util/errors');
const Room = require('../Model/Room');

async function leaveRoom(socket, data, io) {
    if (!isTokenValid(data)) {
        return socket.emit('failed authentication', {
            error: errors(data).auth,
        });
    }

    if (!data.room.name || !data.room._id) {
        return socket.emit('leave error', { error: errors(data).leaveName });
    }

    try {
        const room = await Room.findOne({
            name: data.room.name,
            _id: data.room._id,
        });

        room.members = room.members.filter((member) => {
            if (member.email !== data.email) {
                return member;
            }
        });

        await room.save();
        socket.leave(data.room.name);
        io.to(data.room.name).emit('a member left', room);
        return socket.emit('room left', {
            success: true,
            message: `Vous avez quitté le salon ${data.room.name}`,
        });
    } catch (e) {
        console.error('leave error', e);
        return socket.emit('leave error', { error: e });
    }
}

module.exports = leaveRoom;
