const { getRoomsBodySchema } = require('../RoutesSchemas/Room');
const getRooms = require('../Controller/Rooms/getRooms');

function roomRoutes(fastify, opts, next) {
    fastify.post(
        '/api/rooms/',
        {
            schema: getRoomsBodySchema,
            attachValidation: true,
            preValidation: [fastify.authenticate],
        },
        getRooms
    );

    next();
}

module.exports = roomRoutes;
