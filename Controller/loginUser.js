const User = require('../Model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function loginUser(req, reply) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return reply.status(401).send({ error: 'Identifiants incorrects' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return reply.status(401).send({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign({ email, _id: user._id }, process.env.TOKEN_KEY, {
        expiresIn: '3h',
    });

    reply.status(200).send({
        _id: user._id,
        email: user.email,
        username: user.username,
        picture: user.picture,
        socketID: user.socketID,
        token,
    });
}

module.exports = loginUser;
