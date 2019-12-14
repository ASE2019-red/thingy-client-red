import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { UserService } from './../../resources/user-service';
import { AuthService } from 'aurelia-authentication';
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
        private authService: AuthService,
        private router : Router ) {

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

    private validate(): Promise<boolean> {
        return this.controller.validate().then(result => result.valid);
    }

    public submit() {
        this.validate();
        let jsonData = {
            "name": this.name,
            "email": this.email,
            "psw": this.password
        };
        //return this.authService.signup(this.name, this.email, this.password)
        return this.authService.signup(jsonData)
            .then(response => {
                this.successfulSignup = true;
                console.log("Successfully signed up.");
            })
            .catch(error => {
                this.successfulSignup = false;
                console.log("Failed signup! See error message below.");
                console.log(error);

            })
    }

    public attached() {
        // Remove the navigation bar on the login view
        let navBar = document.getElementById("navigation-bar");
        navBar.parentNode.removeChild(navBar);
    }
}
