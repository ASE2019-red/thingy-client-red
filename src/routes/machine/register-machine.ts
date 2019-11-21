import { autoinject } from 'aurelia-framework';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { MachineService } from './../../resources/machine-service';
import { BootstrapFormRenderer } from './../../resources/validation/bootstrap-form-renderer';

@autoinject
export class RegisterMachine {
    private controller: ValidationController = null;
    private name: string;
    private sensorIdentifier: string;
    private coffeesBeforeMaintenance: number;

    constructor(validationControllerFactory: ValidationControllerFactory,
        private service: MachineService) {

        this.controller = validationControllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());

        const rules = ValidationRules
            .ensure((m: RegisterMachine) => m.name)
            .required()
            .ensure((m: RegisterMachine) => m.sensorIdentifier)
            .required()
            .ensure((m: RegisterMachine) => m.coffeesBeforeMaintenance)
            .required()
            .rules;

        this.controller.addObject(this, rules);
    }

    private submit() {
        this.controller.validate();
    }
}
