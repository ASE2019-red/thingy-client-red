import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../resources/validation/bootstrap-form-renderer';
import { UserService } from '../../resources/user-service';
import { AuthService } from 'aurelia-authentication';


@autoinject
export class Login {
    public email: string;
    public password: string;
    public controller: ValidationController = null;
    public correctLogin: boolean = true;
    public singleUser: string;

    constructor(validationControllerFactory: ValidationControllerFactory,
                private userService: UserService,
                private authService: AuthService,
                private router : Router) {

        this.controller = validationControllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());

        const rules = ValidationRules
            .ensure('password')
            .required()
            .ensure('email')
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
        let jsonData = {
            "email": this.email,
            "psw": this.password
        };
        this.authService.login(jsonData)
            .then(response => {
                console.log("Sucessfully logged in with response: " + response);
                this.correctLogin = true;

            }).catch(error => {
                this.correctLogin = false;
                console.log("Failed to login. See error below:");
                console.log(error);
            });
    }

    public attached() {
        // Remove the navigation bar on the login view
        let navBar = document.getElementById("navigation-bar");
        navBar.parentNode.removeChild(navBar);
    }
}
