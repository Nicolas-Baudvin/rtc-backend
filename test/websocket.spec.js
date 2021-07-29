const { Server } = require('socket.io');
const Client = require('socket.io-client');
const { createServer } = require('http');
const db = require('../Util/Db');
const mongoose = require('mongoose');
const socketAuthentication = require('../WebSocket/auth');
const User = require('../Model/User');
require('dotenv').config();

const fakeUserData = {
    email: 'test@test.fr',
    _id: '6102c4328d01cbea6815dc52',
};

async function getUser() {
    return User.findOne({
        email: process.env.TEST_EMAIL,
        _id: process.env.TEST_ID,
    });
}

describe('Websocket', () => {
    let io, clientSocket, serverSocket, userData;
    beforeEach((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            io.on('connection', (socket) => {
                serverSocket = socket;
            });
            db();
            clientSocket.on('connect', done);
        });
    });

    afterEach(async () => {
        io.close();
        clientSocket.close();
        await mongoose.connection.close();
    });

    it('should login the user', (done) => {
        // Penser à actualiser le token dans le .env pour que le test passe
        serverSocket.on('login', (data) => {
            socketAuthentication(serverSocket, data);
        });
        clientSocket.emit('login', {
            email: process.env.TEST_EMAIL,
            _id: process.env.TEST_ID,
            token: process.env.TEST_TOKEN,
        });
        clientSocket.on('success authentication', (data) => {
            console.log('data : ', data);
            expect(data.success).toEqual(true);
            expect(data.user.socketID).toBeTruthy();
            done();
        });
    });

    it('return an error when trying auth', (done) => {
        serverSocket.on('login', (data) => {
            socketAuthentication(serverSocket, data);
            expect(data.email).toEqual(fakeUserData.email);
            expect(data._id).toEqual(fakeUserData._id);
        });
        clientSocket.emit('login', fakeUserData);
        clientSocket.on('failed authentication', (data) => {
            expect(data.error).toBeTruthy();
            done();
        });
    });
});
