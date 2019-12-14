import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { MachineService } from './../../resources/machine-service';

@autoinject
export class ManageMachines {
    public machines = [];

    constructor(private service: MachineService, private router: Router) {

    }

    public attached() {
        this.service.getAll().then(async response => {
            this.machines = await response.json();
        });
    }

    public viewCalibration(id: string): void {
        console.log(id);
        this.router.navigateToRoute('calibrate', {id});
    }
}
