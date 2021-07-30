const isTokenValid = require('../WebSocket/Util/isTokenValid');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userData = {
    email: process.env.TEST_EMAIL,
    _id: process.env.TEST_ID,
};

const falseEmail = 'false@email.fr';
const falseId = 'falseId';

describe('token validation', () => {
    const token = jwt.sign(userData, process.env.TOKEN_KEY);
    it('should validate the token', () => {
        expect(isTokenValid({ ...userData, token })).toEqual(true);
    });

    it('should not validate the token : bad email', () => {
        expect(isTokenValid({ ...userData, email: falseEmail, token })).toEqual(
            false
        );
    });

    it('should not validate the token : bad _id', () => {
        expect(isTokenValid({ ...userData, _id: falseId, token })).toEqual(
            false
        );
    });

    it('should not validate the token : bad _id && email', () => {
        expect(
            isTokenValid({ email: falseEmail, _id: falseId, token })
        ).toEqual(false);
    });

    it('should not validate the token : no token', () => {
        expect(
            isTokenValid({ email: falseEmail, _id: falseId, token: '' })
        ).toEqual(false);
    });
});
