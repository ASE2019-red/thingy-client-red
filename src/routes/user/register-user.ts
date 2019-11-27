import { autoinject } from 'aurelia-framework';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { UserService } from './../../resources/user-service';
import { BootstrapFormRenderer } from './../../resources/validation/bootstrap-form-renderer';

@autoinject
export class RegisterUser {
    public controller: ValidationController = null;
    public name: string;
    public email: string;
    public password: number;

    constructor(validationControllerFactory: ValidationControllerFactory,
        private service: UserService) {

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
    }

    public validate(): Promise<boolean> {
        return this.controller.validate().then(result => result.valid);
    }

    private submit() {
        this.validate();
    }
}
