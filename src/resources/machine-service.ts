import { json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import { Service } from './service';

@singleton()
export class MachineService extends Service {
    private static readonly ENDPOINT = 'machine';

    public getAll(): Promise<Response> {
        return this.http.fetch(MachineService.ENDPOINT);
    }

    public getCoffees(machineId: string): Promise<Response> {
        const resource = `${MachineService.ENDPOINT}/${machineId}/coffee`;
        return this.http.fetch(resource);
    }

    public saveMachine(machine: any): Promise<Response> {
        const resource = `${MachineService.ENDPOINT}`;
        return this.http.fetch(resource, {
            method: 'post',
            body: json(machine),
        });
    }

    public updateMachine(partial: any): Promise<Response> {
        const resource = `${MachineService.ENDPOINT}`;
        return this.http.fetch(resource, {
            method: 'put',
            body: json(partial),
        });
    }

}
