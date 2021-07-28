const build = require('../app');
const db = require('../Util/Db');
const mongoose = require('mongoose');

describe('signup route', () => {
    const app = build();
    beforeEach(async () => {
        await db();
    });
    afterEach(async () => {
        await mongoose.connection.close();
    });
    it('should return an error 422', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/user/',
            payload: {
                username: '',
                password: '',
                confPass: '',
                email: '',
            },
        });
        expect(response.statusCode).toEqual(422);
    });

    it('should return an error 422 passwords not equal', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/user/',
            payload: {
                username: 'TestTest',
                password: '12345678',
                confPass: '12346',
                email: 'test@test.test',
            },
        });
        expect(response.statusCode).toEqual(422);
    });

    it('create an account and return a 201 status code', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/user/',
            payload: {
                username: 'TestTest',
                password: '12345678',
                confPass: '12345678',
                email: 'test@test.test',
            },
        });
        expect(response.statusCode).toEqual(201);
    });

    it('should return an error 409 same email', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/user/',
            payload: {
                username: 'TestTest1',
                password: '12345678',
                confPass: '12345678',
                email: 'test@test.test',
            },
        });
        console.log('error : ', response.body['error']);
        expect(response.statusCode).toEqual(409);
    });

    it('should return an error 409 same username', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/user/',
            payload: {
                username: 'TestTest',
                password: '12345678',
                confPass: '12345678',
                email: 'test@testtest.test',
            },
        });
        expect(response.statusCode).toEqual(409);
    });

    // it('should delete the user and return a 200 status code', async () => {
    //     const response = await app.inject({
    //         method: 'DELETE',
    //         url: '/api/user/',
    //         payload: {
    //             username: 'TestTest',
    //             password: '12345678',
    //             confPass: '12345678',
    //             email: 'test@test.test',
    //         },
    //     });
    //     expect(response.statusCode).toEqual(200);
    // });
});
