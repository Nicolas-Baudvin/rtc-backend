const { createUserSchema, deleteUserSchema } = require('../RoutesSchemas/User');
const createUser = require('../Controller/createUser');
const deleteUser = require('../Controller/deleteUser');

const userRoutes = async (fastify, opts, next) => {
    fastify.post(
        '/api/user/',
        { schema: createUserSchema, attachValidation: true },
        createUser
    );
    fastify.delete(
        '/api/user/',
        {
            schema: deleteUserSchema,
            attachValidation: true,
            preValidation: [fastify.authenticate],
        },
        deleteUser
    );
    next();
};

module.exports = userRoutes;
