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
                message: { type: 'string' }
            }
        }
    }
}