exports.createUserSchema = {
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            confPass: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['username', 'email', 'confPass', 'password'],
    },
    response: {
        201: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};

exports.deleteUserSchema = {
    body: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
        },
        required: ['_id', 'email'],
    },
};

exports.authUser = {
    body: {
        type: 'object',
        properties: {
            email: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['_id', 'email'],
    },
};
