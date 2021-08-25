const Rooms = require('../../Model/Room');
const RouteError = require('../../Exception/RouteError');

async function getRooms(req, reply) {
    const { _id, email, username } = req.body;

    const owner = { email, _id, username };

    if (req.validationError) {
        const { params, keyword } = req.validationError.validation[0];
        const { status, errorMessage } = new RouteError(
            keyword,
            params.missingProperty
        ).getError();
        return reply.code(status).send({ error: errorMessage });
    }

    try {
        const ownerRooms = await Rooms.find({ owner });
        const memberRooms = await Rooms.find({
            'members.email': email,
        });

        const newRooms = memberRooms.filter(
            (room, i) => room?.name !== ownerRooms[i]?.name
        );

        const rooms = [...ownerRooms, ...newRooms];

        return reply.code(200).send({ rooms });
    } catch (e) {
        console.log(e);
        return reply
            .code(500)
            .send({ error: 'Une erreur est survenue sur le serveur.' });
    }
}

module.exports = getRooms;
