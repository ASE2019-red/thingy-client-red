import { autoinject } from 'aurelia-framework';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../resources/validation/bootstrap-form-renderer';

@autoinject
export class Login {
    private username: string;
    private password: string;
    private controller: ValidationController = null;

    constructor(validationControllerFactory: ValidationControllerFactory) {
        this.controller = validationControllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());

        const rules = ValidationRules
            .ensure((l: Login) => l.password)
            .required()
            .ensure((l: Login) => l.username)
            .required()
            .rules;

        this.controller.addObject(this, rules);
    }

    private submit() {
        this.controller.validate();
    }
}
