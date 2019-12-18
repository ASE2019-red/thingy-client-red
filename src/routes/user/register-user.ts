import { AuthService } from 'aurelia-authentication';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { UserService } from './../../resources/user-service';
import { BootstrapFormRenderer } from './../../resources/validation/bootstrap-form-renderer';

@autoinject
export class RegisterUser {
    public controller: ValidationController = null;
    public name: string;
    public email: string;
    public password: number;
    public successfulSignup: boolean;
    public errorText = '';

    constructor(validationControllerFactory: ValidationControllerFactory,
        private service: UserService,
        private authService: AuthService,
        private router: Router ) {

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

        this.router = router;

        this.authService = authService;
    }

    public validate(): Promise<boolean> {
        return this.controller.validate().then(result => result.valid);
    }

    public submit() {
        this.validate();
        const jsonData = {
            'name': this.name,
            'email': this.email,
            'psw': this.password
        };
        return this.authService.signup(jsonData)
            .then(response => {
                this.successfulSignup = true;
                console.log('Successfully signed up.');
            })
            .catch(async error => {
                this.successfulSignup = false;
                if (error instanceof Response) {
                    this.errorText = await error.text();
                }
                console.log('Failed signup! See error message below.');
                console.log(error);
            });
    }

    public attached() {
        // Remove the navigation bar on the login view
        const navBar = document.getElementById('navigation-bar');
        if (!!navBar) navBar.parentNode.removeChild(navBar);
    }

}
