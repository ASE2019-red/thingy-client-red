import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../resources/validation/bootstrap-form-renderer';
import { UserService } from '../../resources/user-service'

@autoinject
export class Login {
    public email: string;
    public password: string;
    public controller: ValidationController = null;
    public correctLogin: boolean = true;
    public singleUser: string;

    constructor(validationControllerFactory: ValidationControllerFactory,
                private userService: UserService,
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
    }

    public validate(): Promise<boolean> {
        return this.controller.validate().then(result => result.valid);
    }

    public submit() {
        this.validate();
        this.userService.loginUser(this.email, this.password)
            .then(response => {
                if (response.status === 401
                    && response.statusText.search("Authentication failed")!==-1)
                    this.correctLogin = false;
                else {
                    this.correctLogin = true;
                    //add everything into cookie
                    this.router.navigate("home");
                }
                return response.text();
            }).then(user => {
                this.singleUser = user;
            });
    }
}
