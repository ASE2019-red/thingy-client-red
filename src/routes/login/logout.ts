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

        this.router = router;

        this.authService = authService;
    }

    public activate() {

        this.authService.logout()
            .then(response => {
                console.log("Sucessfuly logged out.");
            }).catch(error => {
                console.log("Failed to logout. See error below:");
                console.log(error);
            })
    }
}
