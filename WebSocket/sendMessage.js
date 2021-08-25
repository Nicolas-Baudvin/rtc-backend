const isTokenValid = require('./Util/isTokenValid');
const errors = require('./Util/errors');
const Room = require('../Model/Room');
const Message = require('../Model/Message');

async function createMessage(data) {
    const message = await new Message({
        desc: data.message,
        author: data.username,
        authorPicture: data.picture || '',
        roomId: data.room._id,
    });

    await message.save();

    return message;
}

async function sendMessage(socket, data, io) {
    if (!isTokenValid(data)) {
        return socket.emit('failed authentication', {
            error: errors(data).auth,
        });
    }

    if (!data.message) {
        return socket.emit('message error', {
            error: 'Le message doit contenir au moins 1 caractère',
        });
    }

    try {
        const room = await Room.findOne({
            name: data.room.name,
            _id: data.room._id,
        });
        if (!room) {
            return socket.emit('message error', {
                error: `Le chat ${data.room.name} n'existe pas`,
            });
        }

        const message = await createMessage(data);

        room.messages.push(message);

        await room.save();
        io.to(room.name).emit('message sent', { room, success: true });
    } catch (e) {
        console.error('message error : ', e);
    }
}

module.exports = sendMessage;
