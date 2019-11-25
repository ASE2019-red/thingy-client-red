import { autoinject } from 'aurelia-framework';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../resources/validation/bootstrap-form-renderer';

@autoinject
export class Login {
    username: string;
    password: string;
    public controller: ValidationController = null;

    constructor(validationControllerFactory: ValidationControllerFactory) {
        this.controller = validationControllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());
        this.controller.addObject(this, rules);
    }

    public validate(): Promise<boolean> {
        return this.controller.validate().then(result => result.valid);
    }

    private submit() {
        this.validate();
    }
}

const rules = ValidationRules
    .ensure((l: Login) => l.password)
    .required()
    .ensure((l: Login) => l.username)
    .required()
    .rules;
