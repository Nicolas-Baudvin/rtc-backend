const User = require('../Model/User');
const bcrypt = require('bcrypt');
const RouteError = require('../Exception/RouteError');
const CreateUserBodyValidation = require('../Validation/CreateUserBodyValidation');

function isError(errors) {
    return Boolean(Object.keys(errors).length);
}

function arePasswordsEqual(password, confPass) {
    return password !== confPass;
}

async function createUser(req, reply) {
    if (req.validationError) {
        const { params, keyword } = req.validationError.validation[0];
        const { status, errorMessage } = new RouteError(
            keyword,
            params.missingProperty
        ).getError();
        return reply.code(status).send({ error: errorMessage });
    }

    const { email, password, confPass, username } = req.body;

    const validationErrors = new CreateUserBodyValidation(req.body).errors;
    if (isError(validationErrors)) {
        return reply.code(422).send({ error: validationErrors });
    }

    if (arePasswordsEqual(password, confPass)) {
        return reply
            .code(422)
            .send({ error: 'Les mots de passe sont différents.' });
    }

    const isEmailExist = await User.findOne({ email });
    const isUsernameExist = await User.findOne({ username });

    if (isEmailExist) {
        return reply.code(409).send({ error: 'Cet email est déjà utilisé.' });
    }
    if (isUsernameExist) {
        return reply.code(409).send({ error: 'Ce pseudonyme existe déjà' });
    }

    const hash = await bcrypt.hash(password, 10);
    try {
        const newUser = new User({
            email,
            password: hash,
            username,
            picture: '',
            socketID: '',
        });

        await newUser.save();
        return reply
            .code(201)
            .send({ message: 'Votre compte a été créer avec succès' });
    } catch (e) {
        return reply.code(500).send({ error: 'Erreur sur le serveur' });
    }
}

module.exports = createUser;
