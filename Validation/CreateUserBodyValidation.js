const Validation = require('./Validation');

const messages = [
    'Les mots de passe doivent être identiques',
    'Le mot de passe doit faire 8 caractères minimum',
    'Le pseudo doit faire au moins 3 caractères',
];

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
                password: messages[0],
            };
        } else if (this.password?.length < 8) {
            super.errors = {
                ...super.errors,
                password: messages[1],
            };
        }
    }

    checkUsernameField() {
        if (this.username?.length < 3) {
            super.errors = {
                ...super.errors,
                username: messages[2],
            };
        }
    }
}

module.exports = CreateUserBodyValidation;
