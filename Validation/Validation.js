const messages = ["L'email est invalide"];

class Validation {
    email;
    errors = {};

    constructor(body) {
        this.email = body.email;
        this.checkBody();
    }

    get errors() {
        return this.errors;
    }

    set errors(errors) {
        this.errors = errors;
    }

    checkBody() {
        this.checkEmailField();
    }

    checkEmailField() {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(this.email).toLowerCase())) {
            this.errors = {
                ...this.errors,
                email: messages[0],
            };
        }
    }
}

module.exports = Validation;
