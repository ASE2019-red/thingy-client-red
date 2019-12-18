import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import * as moment from 'moment';
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
            const machineList = await response.json();
            machineList.sort(this.compareByDate),
            this.machines = machineList;
        });
    }

    private compareByDate(a, b): number {
        const d1 = a.createdAt;
        const d2 = b.createdAt;
        if (moment(d1).isBefore(moment(d2))) return -1;
        if (moment(d1).isSame(moment(d2))) return 0;
        return 1;
    }
}
