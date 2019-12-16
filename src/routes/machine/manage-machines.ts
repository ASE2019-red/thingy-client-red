import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { MachineService } from './../../resources/machine-service';

@autoinject
export class ManageMachines {
    public machines = [];
    public alert = {
        show: false,
        level: 'warning',
        text: ''
    };

    constructor(private service: MachineService, private router: Router) {}

    public attached() {
        this.getMachines();
    }

    public viewCalibration(id: string): void {
        this.router.navigateToRoute('calibrate', {id});
    }

    public changeActivation(machine: any): void {
        const id = machine.id;
        let active = machine.active;
        if (active === true) active = false;
        else active = true;
        const update = { id, active };
        this.service.updateMachine(update).then(async response => {
            if (response.ok) {
                this.alert.text = 'Machine updated successfully.';
                this.alert.level = 'success';
                this.alert.show = true;
                this.getMachines();
            } else {
                this.alert.text = `${response.status} - ${response.statusText}`;
                this.alert.level = 'danger';
                this.alert.show = true;
            }
        });
    }

    private getMachines() {
        this.service.getAll().then(async response => {
            this.machines = await response.json();
        });
    }
}
