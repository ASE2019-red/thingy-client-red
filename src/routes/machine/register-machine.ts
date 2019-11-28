import { autoinject } from 'aurelia-framework';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { MachineService } from './../../resources/machine-service';
import { BootstrapFormRenderer } from './../../resources/validation/bootstrap-form-renderer';

@autoinject
export class RegisterMachine {
    public controller: ValidationController = null;
    public name: string;
    public sensorIdentifier: string;
    public coffeesBeforeMaintenance: number;

    constructor(validationControllerFactory: ValidationControllerFactory,
        private service: MachineService) {

        this.controller = validationControllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());

        const rules = ValidationRules
            .ensure('name')
            .required()
            .ensure('sensorIdentifier')
            .required()
            .ensure('coffeesBeforeMaintenance')
            .required()
            .rules;

        this.controller.addObject(this, rules);
    }

    public validate(): Promise<boolean> {
        return this.controller.validate().then(result => result.valid);
    }

    private submit() {
        this.validate().then(isValid => {
            if (isValid) {
                this.service.saveMachine(this.name, this.sensorIdentifier, this.coffeesBeforeMaintenance);
            }
        });
    }
}
