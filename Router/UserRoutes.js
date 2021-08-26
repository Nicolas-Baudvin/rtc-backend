const {
    createUserSchema,
    deleteUserSchema,
    authUser,
    patchUser,
} = require('../RoutesSchemas/User');
const createUser = require('../Controller/createUser');
const deleteUser = require('../Controller/deleteUser');
const loginUser = require('../Controller/loginUser');
const patchUserDatas = require('../Controller/patchUserDatas');

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

    fastify.post(
        '/api/user/auth/',
        { schema: authUser, attachValidation: true },
        loginUser
    );

    fastify.patch(
        '/api/user/',
        {
            schema: patchUser,
            attachValidation: true,
            preValidation: [fastify.authenticate],
        },
        patchUserDatas
    );

    next();
};

module.exports = userRoutes;
