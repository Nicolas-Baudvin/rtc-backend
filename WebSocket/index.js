const socketAuthentication = require('./auth');
const createRoom = require('./createRoom');
const deleteRoom = require('./deleteRoom');
const joinRoom = require('./joinRoom');
const leaveRoom = require('./leaveRoom');
const sendMessage = require('./sendMessage');

function socketEventController(socket, io) {
    console.log("Quelqu'un s'est connecté");
    socket.on('login', (data) => socketAuthentication(socket, data));
    socket.on('create room', (data) => createRoom(socket, data));
    socket.on('delete room', (data) => deleteRoom(socket, data, io));
    socket.on('join room', (data) => joinRoom(socket, data, io));
    socket.on('leave room', (data) => leaveRoom(socket, data, io));
    socket.on('sendMessage', (data) => sendMessage(socket, data, io));
    socket.on('disconnect client', (data) => {
        console.log("Quelqu'un s'est déconnecté", data);
        socket.disconnect();
    });
}

module.exports = socketEventController;
