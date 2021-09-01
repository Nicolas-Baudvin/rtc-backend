const Room = require('../Model/Room');

async function disconnectFromRoom(socket, data, io) {
    const { username } = data;

    const room = await Room.findOne({
        name: data.room.name,
        _id: data.room._id,
    });

    room.members = room.members.map((member) => {
        if (member.username === username) {
            member.isOnline = false;
        }
        return member;
    });

    await room.save();

    socket.leave(data.room.name);

    socket.emit(
        'disconnected success',
        `vous êtes déconnectés du salon ${room.name}`
    );
    io.to(data.room.name).emit('member disconnect', { room });
}

module.exports = disconnectFromRoom;
