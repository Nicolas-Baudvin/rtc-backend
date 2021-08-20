const Rooms = require('../../Model/Room');
const RouteError = require('../../Exception/RouteError');

async function getRooms(req, reply) {
    const { _id, email, username } = req.body;

    if (req.validationError) {
        const { params, keyword } = req.validationError.validation[0];
        const { status, errorMessage } = new RouteError(
            keyword,
            params.missingProperty
        ).getError();
        return reply.code(status).send({ error: errorMessage });
    }

    try {
        const rooms = await Rooms.find({ owner: { _id, email, username } });

        return reply.code(200).send({ rooms });
    } catch (e) {
        return reply
            .code(500)
            .send({ error: 'Une erreur est survenue sur le serveur.' });
    }
}

module.exports = getRooms;
