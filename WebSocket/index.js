const socketAuthentication = require('./auth');

function socketEventController(socket) {
    console.log("Quelqu'un s'est connecté");
    socket.on('login', (data) => socketAuthentication(socket, data));
}

module.exports = socketEventController;
