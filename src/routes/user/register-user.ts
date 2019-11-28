import { autoinject } from 'aurelia-framework';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { UserService } from './../../resources/user-service';
import { AuthService } from 'aurelia-auth';
import { BootstrapFormRenderer } from './../../resources/validation/bootstrap-form-renderer';

@autoinject
export class RegisterUser {
    public controller: ValidationController = null;
    public name: string;
    public email: string;
    public password: number;
    public successfulSignup: boolean;

    constructor(validationControllerFactory: ValidationControllerFactory,
        private service: UserService,
        private authService: AuthService) {

        this.controller = validationControllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());

        const rules = ValidationRules
            .ensure('name')
            .required()
            .ensure('email')
            .required()
            .ensure('password')
            .required()
            .rules;

        this.controller.addObject(this, rules);

        this.authService = authService;
    }

    public validate(): Promise<boolean> {
        return this.controller.validate().then(result => result.valid);
    }

    private submit() {
        this.validate();
/*         let jsonData = {};
        jsonData['name'] = this.name;
        jsonData['email'] = this.email;
        jsonData['psw'] = this.password; */
        return this.authService.signup(this.name, this.email, this.password)
            .then(response => {
                this.successfulSignup = true;
                console.log("Successfully signed up.");
            })
            .catch(error => {
                this.successfulSignup = false;
                console.log("Failed signup! See error message below.");
                console.log(error.response);

            })
    }
}
