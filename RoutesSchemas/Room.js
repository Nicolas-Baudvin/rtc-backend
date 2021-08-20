exports.getRoomsBodySchema = {
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            _id: { type: 'string' },
        },
        required: ['username', 'email', '_id'],
    },
};
