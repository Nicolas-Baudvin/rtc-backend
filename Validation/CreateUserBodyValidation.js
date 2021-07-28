const Validation = require('./Validation');

class CreateUserBodyValidation extends Validation {
    password;
    confPass;
    username;

    constructor(body) {
        super(body);
        this.confPass = body.confPass;
        this.password = body.password;
        this.username = body.username;
        this.checkBody();
    }

    checkBody() {
        super.checkBody();
        this.checkPasswordsFields();
        this.checkUsernameField();
    }

    checkPasswordsFields() {
        if (this.password !== this.confPass) {
            super.errors = {
                ...super.errors,
                password: 'Les mots de passe doivent être identiques',
            };
        } else if (this.password?.length < 8) {
            super.errors = {
                ...super.errors,
                password: 'Le mot de passe doit faire 8 caractères minimum',
            };
        }
    }

    checkUsernameField() {
        if (this.username?.length < 8) {
            super.errors = {
                ...super.errors,
                username: `Le pseudo doit faire au moins 8 caractères`,
            };
        }
    }
}

module.exports = CreateUserBodyValidation;
