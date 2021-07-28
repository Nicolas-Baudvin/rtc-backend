const RouteError = require('../Exception/RouteError');
const User = require('../Model/User');

async function deleteUser(req, reply) {
    if (req.validationError) {
        const { params, keyword } = req.validationError.validation[0];
        const { status, errorMessage } = new RouteError(
            keyword,
            params.missingProperty
        ).getError();
        return reply.code(status).send({ error: errorMessage });
    }
    const { email, _id } = req.body;

    try {
        await User.deleteOne({ email, _id });
        return reply
            .status(200)
            .send({ message: 'Votre compte a bien été supprimé' });
    } catch (e) {
        console.error(e);
        return reply
            .status(500)
            .send({ error: 'Une erreur est survenue sur le serveur' });
    }
}

module.exports = deleteUser;
