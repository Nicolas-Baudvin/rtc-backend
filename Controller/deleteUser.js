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

    await User.deleteOne({ email, _id });
}
