const { Server } = require('socket.io');
const Client = require('socket.io-client');
const { createServer } = require('http');
const db = require('../Util/Db');
const mongoose = require('mongoose');
const socketAuthentication = require('../WebSocket/auth');
const createRoom = require('../WebSocket/createRoom');
const User = require('../Model/User');
require('dotenv').config();

const roomName = 'RoomTest';
const falseToken = 'ey74w5f4gfd5xcfgxhgxccx54xd';

const fakeUserData = {
    email: 'test@test.fr',
    _id: '6102c4328d01cbea6815dc52',
};

const userData = {
    email: process.env.TEST_EMAIL,
    _id: process.env.TEST_ID,
    token: process.env.TEST_TOKEN,
};

async function getUser() {
    return User.findOne({
        email: process.env.TEST_EMAIL,
        _id: process.env.TEST_ID,
    });
}

describe('Websocket', () => {
    let io, clientSocket, serverSocket;
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

    /**
     * User authentication when connecting to the socket
     */
    it('should login the user', (done) => {
        // Penser à actualiser le token dans le .env pour que le test passe
        serverSocket.on('login', (data) => {
            socketAuthentication(serverSocket, data);
        });
        clientSocket.emit('login', userData);
        clientSocket.on('success authentication', (data) => {
            expect(data.success).toEqual(true);
            expect(data.user.socketID).toBeTruthy();
            done();
        });
    });

    it('should return an error when trying auth', (done) => {
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

    /**
     * Create Room
     */
    it('should return an error of authentication', (done) => {
        serverSocket.on('create room', (data) => {
            createRoom(serverSocket, data);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(falseToken);
            expect(data.roomName).toEqual(roomName);
        });
        clientSocket.emit('create room', {
            ...userData,
            token: falseToken,
            roomName,
        });
        clientSocket.on('failed authentication', (data) => {
            expect(data.error).toBeTruthy();
            done();
        });
    });

    it('should create a room', (done) => {
        serverSocket.on('create room', (data) => {
            createRoom(serverSocket, data);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.roomName).toEqual(roomName);
        });
        clientSocket.emit('create room', {
            ...userData,
            roomName,
        });
        clientSocket.on('room created', (data) => {
            expect(data.success).toEqual(true);
            expect(data.room.name).toEqual(roomName);
            done();
        });
    });
});
