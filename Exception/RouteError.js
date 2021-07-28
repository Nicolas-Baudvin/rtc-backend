const errorMessages = {
    missingParams: (missingParams) =>
        `Le champs ${missingParams} est manquant mais obligatoire !`,
    wrongCredentials: `Les identifiants sont incorrects.`,
    serverFail: 'Une erreur est survenue sur le serveur',
};

class RouteError {
    missingParams;
    errorType;
    status;
    errorMessage;

    constructor(errorType = '', missingParams = '') {
        this.missingParams = missingParams;
        this.errorType = errorType;
        this.status = 500;
        this.errorMessage = '';
        this.create();
    }

    getError() {
        return {
            status: this.status,
            errorMessage: this.errorMessage,
        };
    }

    create() {
        switch (this.errorType) {
            case 'required': {
                this.status = 422;
                this.errorMessage = errorMessages.missingParams(
                    this.missingParams
                );
                break;
            }
            case 'credentials': {
                this.status = 403;
                this.errorMessage = errorMessages.wrongCredentials;
                break;
            }
            default: {
                this.status = 500;
                this.errorMessage = errorMessages.serverFail;
                break;
            }
        }
    }
}

module.exports = RouteError;
