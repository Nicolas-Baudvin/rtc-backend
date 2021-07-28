const Validation = require('../Validation/Validation');
const CreateUserBodyValidation = require('../Validation/CreateUserBodyValidation');

describe('Validations stuff', () => {
    it('should return invalid email message', () => {
        const body = { email: '' };
        const validation = new Validation(body);
        expect(validation.errors.email).toEqual("L'email est invalide");
    });

    it('should return a message : passwords not equal', () => {
        const body = {
            email: 'test@test.test',
            password: '12345678',
            confPass: '123456',
            username: 'testtest',
        };
        const validation = new CreateUserBodyValidation(body).errors;
        expect(validation.password).toEqual(
            'Les mots de passe doivent être identiques'
        );
    });

    it('should return a message : password should have at least 8 chars', () => {
        const body = {
            email: 'test@test.test',
            password: '',
            confPass: '',
            username: 'testtest',
        };
        const validation = new CreateUserBodyValidation(body).errors;
        expect(validation.password).toEqual(
            'Le mot de passe doit faire 8 caractères minimum'
        );
    });

    it('should return a message : username should have at least 8 chars', () => {
        const body = {
            email: 'test@test.test',
            password: '12345678',
            confPass: '12345678',
            username: '',
        };
        const validation = new CreateUserBodyValidation(body).errors;
        expect(validation.username).toEqual(
            'Le pseudo doit faire au moins 8 caractères'
        );
    });
});
