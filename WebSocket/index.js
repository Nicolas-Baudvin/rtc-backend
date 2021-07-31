const socketAuthentication = require('./auth');
const createRoom = require('./createRoom');
const deleteRoom = require('./deleteRoom');

function socketEventController(socket, io) {
    console.log("Quelqu'un s'est connecté");
    socket.on('login', (data) => socketAuthentication(socket, data));
    socket.on('create room', (data) => createRoom(socket, data));
    socket.on('delete room', (data) => deleteRoom(socket, data, io));
}

module.exports = socketEventController;
