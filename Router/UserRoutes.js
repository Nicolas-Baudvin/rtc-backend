const { createUserSchema } = require("../RoutesSchemas/User");
const createUser = require('../Controller/createUser');

const userRoutes = async (fastify, opts, next) => {
    fastify.post('/api/user/', { schema: createUserSchema, attachValidation: true }, createUser );
    next();
};

module.exports = userRoutes;