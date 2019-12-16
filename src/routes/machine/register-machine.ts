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
    public alert = {
        show: false,
        level: 'warning',
        text: '',
        btn: false,
    };

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
            const response = await this.service.saveMachine(machine);
            if (response.ok) {
                this.alert.text = 'Machine registered successfully';
                this.alert.level = 'success';
                this.alert.btn = true;
                this.alert.show = true;
            } else {
                this.alert.text = `${response.status} - ${response.statusText}`;
                this.alert.level = 'danger';
                this.alert.btn = false;
                this.alert.show = true;
            }
        }
    }
}
