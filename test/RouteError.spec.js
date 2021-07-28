const RouteError = require('../Exception/RouteError');

const errorMessages = {
    missingParams: (missingParams) =>
        `Le champs ${missingParams} est manquant mais obligatoire !`,
    wrongCredentials: `Les identifiants sont incorrects.`,
    serverFail: 'Une erreur est survenue sur le serveur',
};

describe('RouteError', () => {
    it('should return a status 500 with message : server failed', () => {
        const error = new RouteError().getError();
        expect(error.status).toEqual(500);
        expect(error.errorMessage).toEqual(errorMessages.serverFail);
    });

    it('should return a 422 error status with message : empty field', () => {
        const missingParams = 'username';
        const errorType = 'required';
        const error = new RouteError(errorType, missingParams).getError();
        expect(error.status).toEqual(422);
        expect(error.errorMessage).toEqual(
            errorMessages.missingParams(missingParams)
        );
    });

    it('should return a 403 error status with message : wrong credentials', () => {
        const error = new RouteError('credentials', '').getError();
        expect(error.status).toEqual(403);
        expect(error.errorMessage).toEqual(errorMessages.wrongCredentials);
    });
});
