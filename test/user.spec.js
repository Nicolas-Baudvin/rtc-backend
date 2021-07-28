const build = require('../app');
const db = require('../Util/Db');
const mongoose = require('mongoose');

describe('user routes', () => {
    const app = build();
    let userData;

    beforeEach(async () => {
        await db();
    });

    afterEach(async () => {
        await mongoose.connection.close();
    });

    /*
     * CREATE route
     * */

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

    /*
     * LOGIN Route
     * */

    it('should connect the user and return token', async () => {
        const email = 'test@test.test';
        const password = '12345678';
        const response = await app.inject({
            method: 'POST',
            url: '/api/user/auth/',
            payload: {
                email: email,
                password: password,
            },
        });
        const body = JSON.parse(response.body);
        userData = body;
        expect(response.statusCode).toEqual(200);
        expect(body.email).toEqual(email);
        expect(body.token).toBeTruthy();
        expect(body._id).toBeTruthy();
    });

    it('should return a 403 bad credentials', async () => {
        const email = 'test@testttt.test';
        const password = '12345678';
        const response = await app.inject({
            method: 'POST',
            url: '/api/user/auth/',
            payload: {
                email: email,
                password: password,
            },
        });

        expect(response.statusCode).toEqual(403);
    });

    /*
     * DELETE Route
     * */

    it('should return a 403 error status code', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/api/user/',
            payload: {
                email: userData.email,
                _id: userData._id,
            },
        });

        expect(response.statusCode).toEqual(403);
    });

    it('should delete the user and return a 200 status code', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/api/user/',
            payload: {
                email: userData.email,
                _id: userData._id,
            },
            headers: {
                authorization: `Bearer ${userData.token}`,
            },
        });
        expect(response.statusCode).toEqual(200);
    });
});
