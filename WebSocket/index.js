const socketAuthentication = require('./auth');
const createRoom = require('./createRoom');
const deleteRoom = require('./deleteRoom');

function socketEventController(socket) {
    console.log("Quelqu'un s'est connecté");
    socket.on('login', (data) => socketAuthentication(socket, data));
    socket.on('create room', (data) => createRoom(socket, data));
    socket.on('delete room', (data) => deleteRoom(socket, data));
}

module.exports = socketEventController;
