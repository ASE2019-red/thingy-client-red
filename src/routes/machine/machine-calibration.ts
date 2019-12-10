export class MachineCalibration {
    public id: string;

    public activate(params, routeConfig, navigationInstruction) {
        this.id = params.id;
    }

    public deactivate() {
        console.log('abort');
    }
}
