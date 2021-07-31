const Room = require('../Model/Room');
const Message = require('../Model/Message');
const isTokenValid = require('./Util/isTokenValid');

async function deleteRoom(socket, data, io) {
    if (!isTokenValid(data)) {
        return socket.emit('failed authentication', {
            error: 'Vous ne pouvez accéder à cette fonctionnalité, reconnectez vous.',
        });
    }

    const { _id, name } = data.room;

    if (!_id || !name) {
        return socket.emit('delete error', {
            error: 'Impossible de trouver ce chat !',
        });
    }

    try {
        await Room.deleteOne({ _id, name });
        await Message.deleteMany({ roomId: _id });

        io.to(name).emit('leave');

        return socket.emit('room deleted', {
            success: true,
            message: 'Le chat et tous les messages ont bien été supprimé',
        });
    } catch (e) {
        console.error('server error : ', e);
        return socket.emit(
            'server fail',
            'Le serveur a rencontré un problème.'
        );
    }
}

module.exports = deleteRoom;
