const User = require('../Model/User');
const Room = require('../Model/Room');
const bcrypt = require('bcrypt');

function isUsernameValid(username) {
    return username.length >= 3 && username.length <= 20;
}

function isEmailValid(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function arePasswordsEqual(newPass, newConfPass) {
    return newPass === newConfPass;
}

function isPasswordValid(password) {
    return password.length >= 8 && password.length <= 30;
}

async function getUserById(_id) {
    return User.findOne({ _id });
}

async function hashPassword(passwordToHash, salt) {
    return bcrypt.hash(passwordToHash, salt);
}

async function getRoomsByMemberEmail(email) {
    return Room.find({ 'members.email': email });
}

function replaceOldMemberData(room, user, newData) {
    const { username, email } = newData;
    return room.members.map((member) => {
        if (member.email === user.email) {
            member.email = email;
            member.username = username;
        }
        return member;
    });
}

function replaceOldMessagesAuthorData(room, user, newData) {
    const { username, picture } = newData;

    return room.messages.map((message) => {
        if (message.author === user.username) {
            message.author = username;
            message.authorPicture = picture;
        }
        return message;
    });
}

function updateRoomsWithNewUserData(rooms, user, newData) {
    const { email, username, picture } = newData;
    rooms.forEach(async (room) => {
        room.members = replaceOldMemberData(room, user, { email, username });
        room.messages = replaceOldMessagesAuthorData(room, user, {
            username,
            picture,
        });
        if (room.owner.email === user.email) {
            room.owner.email = email;
            room.owner.username = username;
        }
        await Room.updateOne(
            { _id: room._id },
            {
                members: room.members,
                messages: room.messages,
                owner: room.owner,
            }
        );
    });
}

async function patchUserDatas(req, reply) {
    const { email, username, newPass, newPassConf, picture, _id } = req.body;

    const user = await getUserById(_id);

    if (!isUsernameValid(username)) {
        return reply.code(422).send({
            error: 'Le pseudonyme doit faire entre 3 et 20 caractères',
        });
    }
    if (!isEmailValid(email)) {
        return reply.code(422).send({
            error: "L'Email est invalide",
        });
    }

    const rooms = await getRoomsByMemberEmail(user.email);

    if (rooms.length) {
        updateRoomsWithNewUserData(rooms, user, req.body);
    }

    user.email = email;
    user.username = username;
    user.picture = picture;

    if (newPass) {
        if (!arePasswordsEqual(newPass, newPassConf)) {
            return reply.code(422).send({
                error: 'Les mots de passe sont différents',
            });
        }
        if (!isPasswordValid(newPass)) {
            return reply.code(422).send({
                error: 'Le mot de passe doit faire entre 8 et 30 caractères',
            });
        }

        user.password = await hashPassword(newPass, 10);
    }

    await user.save();

    return reply.code(200).send({
        user: {
            email: user.email,
            username: user.username,
            picture: user.picture,
        },
        message: 'Vos données ont bien été mises à jour',
    });
}

module.exports = patchUserDatas;
