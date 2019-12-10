import { json } from 'aurelia-fetch-client';
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
            .matches(/\d+/)
            .rules;

        this.controller.addObject(this, rules);
    }

    public attached() {
        this.service.getAll().then(async response => {
            const machines = await response.json();
            console.log(machines);
        });
    }

    public validate(): Promise<boolean> {
        return this.controller.validate().then(result => result.valid);
    }

    private async submit() {
        if (await this.validate()) {
            const machine = {
                name: this.name,
                sensorIdentifier: this.sensorIdentifier,
            };
            if (this.coffeesBeforeMaintenance) {
                machine['maintenanceThreshold'] = this.coffeesBeforeMaintenance;
            }
            await this.service.saveMachine(machine);
        }
    }
}
