const User = require('../Model/User');

function isUsernameValid(username) {
    return username.length >= 3;
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

async function getUser(email, username) {
    return User.findOne({ email, username });
}

// TODO: Picture validation
async function patchUserDatas(req, reply) {
    const { email, username, newPass, newPassConf } = req.body;

    const user = await getUser(email, username);

    if (isUsernameValid(username)) {
        return reply.code(422).send({
            error: 'Le pseudonyme doit faire entre 3 et 20 caractères',
        });
    }
    if (isEmailValid(email)) {
        return reply.code(422).send({
            error: "L'Email est invalide",
        });
    }
    if (!newPass) {
        user.email = email;
        user.username = username;
    } else {
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
        user.email = email;
        user.username = username;
        user.password = newPass;
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
