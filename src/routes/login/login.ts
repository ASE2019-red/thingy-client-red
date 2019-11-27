import { autoinject } from 'aurelia-framework';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../resources/validation/bootstrap-form-renderer';

@autoinject
export class Login {
    public username: string;
    public password: string;
    public controller: ValidationController = null;

    constructor(validationControllerFactory: ValidationControllerFactory) {
        this.controller = validationControllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());

        const rules = ValidationRules
            .ensure('password')
            .required()
            .ensure('username')
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
