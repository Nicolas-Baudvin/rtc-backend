const fp = require('fastify-plugin');
const jwt = require('fastify-jwt');

function jwtPlugin(fastify, opts, next) {
    fastify.register(jwt, {
        secret: process.env.TOKEN_KEY,
    });

    fastify.decorate('authenticate', async function (request, reply) {
        const { _id } = request.body;
        const token = request.headers?.authorization?.split(' ')[1];
        if (!token || !_id) {
            return reply.code(403).send({ error: 'Accès interdit.' });
        }
        try {
            const decoded = await fastify.jwt.verify(token);
            if (decoded._id !== _id) {
                return reply.code(403).send('Accès interdit.');
            }
        } catch (err) {
            return reply.code(403).send({
                err,
                error: "Vous n'avez pas accès à cette fonctionnalité : reconnectez vous.",
            });
        }
    });
    next();
}

module.exports = fp(jwtPlugin, { fastify: '>=1.0.0' });
