import { bindable } from 'aurelia-framework';

export class MachineState {
    @bindable public active: boolean = false;
    @bindable public calibrated: boolean = false;
    @bindable public summary: boolean = true;
}
