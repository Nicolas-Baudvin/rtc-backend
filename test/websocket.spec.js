const { Server } = require('socket.io');
const Client = require('socket.io-client');
const { createServer } = require('http');
const db = require('../Util/Db');
const mongoose = require('mongoose');
const socketAuthentication = require('../WebSocket/auth');
const createRoom = require('../WebSocket/createRoom');
const deleteRoom = require('../WebSocket/deleteRoom');
const joinRoom = require('../WebSocket/joinRoom');
const sendMessage = require('../WebSocket/sendMessage');
const leaveRoom = require('../WebSocket/leaveRoom');
require('dotenv').config();

const fakeRoomName = 'RoomTest';
const falseToken = 'ey74w5f4gfd5xcfgxhgxccx54xd';

const fakeUserData = {
    email: 'test@test.fr',
    _id: '6102c4328d01cbea6815dc52',
};

const userData = {
    email: process.env.TEST_EMAIL,
    _id: process.env.TEST_ID,
    token: process.env.TEST_TOKEN,
    picture: '',
    username: 'TestTest',
};

describe('Websocket', () => {
    let io, clientSocket, serverSocket, roomId, roomName;
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

    it('should return an error when trying to auth', (done) => {
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
            expect(data.password).toEqual('123456');
            expect(data.roomName).toEqual(fakeRoomName);
        });
        clientSocket.emit('create room', {
            ...userData,
            token: falseToken,
            password: '123456',
            roomName: fakeRoomName,
        });
        clientSocket.on('failed authentication', (data) => {
            expect(data.error).toBeTruthy();
            done();
        });
    });

    it('should return an error of no password for room', (done) => {
        serverSocket.on('create room', (data) => {
            createRoom(serverSocket, data);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.password).toEqual('');
            expect(data.roomName).toEqual(fakeRoomName);
        });
        clientSocket.emit('create room', {
            ...userData,
            password: '',
            roomName: fakeRoomName,
        });
        clientSocket.on('create error', (data) => {
            expect(data.error).toEqual('Le mot de passe est obligatoire !');
            done();
        });
    });

    it('should return en error of no name for room', (done) => {
        serverSocket.on('create room', (data) => {
            createRoom(serverSocket, data);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.password).toEqual('123456');
            expect(data.roomName).toEqual(undefined);
        });
        clientSocket.emit('create room', {
            ...userData,
            password: '123456',
            roomName: undefined,
        });
        clientSocket.on('create error', (data) => {
            expect(data.error).toEqual('Le nom est obligatoire !');
            done();
        });
    });

    it('should create a room', (done) => {
        serverSocket.on('create room', (data) => {
            createRoom(serverSocket, data);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.roomPass).toEqual('123456');
            expect(data.roomName).toEqual(fakeRoomName);
        });
        clientSocket.emit('create room', {
            ...userData,
            roomPass: '123456',
            roomName: fakeRoomName,
        });
        clientSocket.on('room created', (data) => {
            expect(data.success).toEqual(true);
            expect(data.room.name).toEqual(fakeRoomName);
            roomId = data.room._id;
            roomName = data.room.name;
            done();
        });
    });

    /**
     * Join room
     */

    it('should return an error of authentication when trying to join a room', (done) => {
        serverSocket.on('join room', (data) => {
            joinRoom(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(falseToken);
            expect(data.room.name).toEqual(roomName);
        });
        clientSocket.emit('join room', {
            ...userData,
            token: falseToken,
            room: { name: roomName, _id: '' },
        });
        clientSocket.on('failed authentication', (data) => {
            expect(data.error).toBeTruthy();
            done();
        });
    });

    it('should return an error : no room with this name', (done) => {
        const falseRoomName = 'falseRoomName';
        serverSocket.on('join room', (data) => {
            joinRoom(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.room.name).toEqual(falseRoomName);
        });
        clientSocket.emit('join room', {
            ...userData,
            room: { name: falseRoomName, _id: process.env.TEST_RANDOM_ID },
        });
        clientSocket.on('join error', (data) => {
            expect(data.error).toEqual(
                `Aucun chat avec le nom ${falseRoomName} n'existe`
            );
            done();
        });
    });

    it('should return an error: no name given', (done) => {
        serverSocket.on('join room', (data) => {
            joinRoom(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.room.name).toEqual('');
        });
        clientSocket.emit('join room', {
            ...userData,
            room: { name: '', _id: process.env.TEST_RANDOM_ID },
        });
        clientSocket.on('join error', (data) => {
            expect(data.error).toEqual(
                `Le champs 'nom du chat' est obligatoire`
            );
            done();
        });
    });

    it('should join the room', (done) => {
        serverSocket.on('join room', (data) => {
            joinRoom(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.room.name).toEqual(roomName);
            expect(data.room._id).toEqual(roomId);
        });
        clientSocket.emit('join room', {
            ...userData,
            room: { name: roomName, _id: roomId },
        });
        clientSocket.on('room joined', (data) => {
            expect(data.room.name).toEqual(roomName);
            expect(data.room._id).toEqual(roomId);
            expect(data.room.members.length).toEqual(1);
            done();
        });
    });

    /**
     * Send message in the room
     */

    it('return an error of authentication when trying to send a message in a room', (done) => {
        const message = 'Hello World';
        serverSocket.on('send message', (data) => {
            sendMessage(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(falseToken);
            expect(data.message).toEqual(message);
        });

        clientSocket.emit('send message', {
            ...userData,
            token: falseToken,
            message,
            room: { name: roomName, _id: roomId },
        });

        clientSocket.on('failed authentication', (data) => {
            expect(data.error).toBeTruthy();
            done();
        });
    });

    it('return an error : message is empty', (done) => {
        const message = '';
        serverSocket.on('send message', (data) => {
            sendMessage(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.message).toEqual(message);
        });

        clientSocket.emit('send message', {
            ...userData,
            message,
            room: { name: roomName, _id: roomId },
        });

        clientSocket.on('message error', (data) => {
            expect(data.error).toEqual(
                'Le message doit contenir au moins 1 caractère'
            );
            done();
        });
    });

    it('return an error : room does not exist', (done) => {
        const message = 'Hello World';
        const falseRoomName = 'falseRoomName';
        serverSocket.on('send message', (data) => {
            sendMessage(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.message).toEqual(message);
            expect(data.room.name).toEqual(falseRoomName);
        });

        clientSocket.emit('send message', {
            ...userData,
            message,
            room: { name: falseRoomName, _id: roomId },
        });

        clientSocket.on('message error', (data) => {
            expect(data.error).toEqual(`Le chat ${falseRoomName} n'existe pas`);
            done();
        });
    });

    it("should send a message to user's chat", (done) => {
        const message = 'Hello World';
        serverSocket.on('send message', (data) => {
            serverSocket.join(roomName); // have to rejoin bc socket close at each test.
            sendMessage(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.message).toEqual(message);
            expect(data.room.name).toEqual(roomName);
        });

        clientSocket.emit('send message', {
            ...userData,
            message,
            room: { name: roomName, _id: roomId },
        });

        clientSocket.on('message sent', (data) => {
            expect(data.success).toEqual(true);
            expect(data.room.messages.length).toEqual(1);
            done();
        });
    });

    /**
     * Leave the room
     */

    it('should return an error of authentication when trying to leave the room', (done) => {
        serverSocket.on('leave room', (data) => {
            leaveRoom(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(falseToken);
            expect(data.room.name).toEqual(roomName);
            expect(data.room._id).toEqual(roomId);
        });
        clientSocket.emit('leave room', {
            ...userData,
            token: falseToken,
            room: { name: roomName, _id: roomId },
        });
        clientSocket.on('failed authentication', (data) => {
            expect(data.error).toBeTruthy();
            done();
        });
    });

    it('should return an error : no room name', (done) => {
        const falseRoomName = '';
        serverSocket.on('leave room', (data) => {
            leaveRoom(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.room.name).toEqual(falseRoomName);
            expect(data.room._id).toEqual(roomId);
        });
        clientSocket.emit('leave room', {
            ...userData,
            room: { name: falseRoomName, _id: roomId },
        });
        clientSocket.on('leave error', (data) => {
            expect(data.error).toBeTruthy();
            done();
        });
    });

    it('should leave the room', (done) => {
        serverSocket.on('leave room', (data) => {
            serverSocket.join(roomName); // have to rejoin bc socket close at each test.
            leaveRoom(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.room.name).toEqual(roomName);
            expect(data.room._id).toEqual(roomId);
        });
        clientSocket.emit('leave room', {
            ...userData,
            room: { name: roomName, _id: roomId },
        });
        clientSocket.on('room left', (data) => {
            expect(data.success).toEqual(true);
            expect(data.message).toEqual(
                `Vous avez quitté le salon ${roomName}`
            );
            done();
        });
    });

    /**
     * Delete room
     */

    it('should return an error of authentication when trying to delete room', (done) => {
        serverSocket.on('delete room', (data) => {
            deleteRoom(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(falseToken);
            expect(data.room._id).toEqual(roomId);
            expect(data.room.name).toEqual(roomName);
        });
        clientSocket.emit('delete room', {
            ...userData,
            token: falseToken,
            room: { _id: roomId, name: roomName },
        });
        clientSocket.on('failed authentication', (data) => {
            expect(data.error).toBeTruthy();
            done();
        });
    });

    it('should return a delete error : no name or id', (done) => {
        serverSocket.on('delete room', (data) => {
            deleteRoom(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.room._id).toEqual(undefined);
            expect(data.room.name).toEqual(roomName);
        });
        clientSocket.emit('delete room', {
            ...userData,
            room: { _id: undefined, name: roomName },
        });
        clientSocket.on('delete error', (data) => {
            expect(data.error).toEqual('Impossible de trouver ce chat !');
            done();
        });
    });

    it('should delete the room', (done) => {
        serverSocket.on('delete room', (data) => {
            deleteRoom(serverSocket, data, io);
            expect(data.email).toEqual(userData.email);
            expect(data._id).toEqual(userData._id);
            expect(data.token).toEqual(userData.token);
            expect(data.room._id).toEqual(roomId);
            expect(data.room.name).toEqual(roomName);
        });
        clientSocket.emit('delete room', {
            ...userData,
            room: { _id: roomId, name: roomName },
        });
        clientSocket.on('room deleted', (data) => {
            expect(data.success).toEqual(true);
            expect(data.message).toEqual(
                'Le chat et tous les messages ont bien été supprimé'
            );
            done();
        });
    });
});
