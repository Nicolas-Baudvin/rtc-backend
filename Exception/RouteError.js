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

    newError(status, errorMessage) {
        this.status = status;
        this.errorMessage = errorMessage;
    }

    create() {
        switch (this.errorType) {
            case 'required': {
                this.newError(
                    422,
                    errorMessages.missingParams(this.missingParams)
                );
                break;
            }
            case 'credentials': {
                this.newError(403, errorMessages.wrongCredentials);
                break;
            }
            default: {
                this.newError(500, errorMessages.serverFail);
                break;
            }
        }
    }
}

module.exports = RouteError;
