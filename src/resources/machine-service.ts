import { AureliaConfiguration } from 'aurelia-configuration';
import { HttpClient } from 'aurelia-fetch-client';
import { autoinject, singleton } from 'aurelia-framework';
import { Service } from './service';

@singleton()
export class MachineService extends Service {
    private static readonly ENDPOINT = 'machine';

    public getAll(): Promise<Response> {
        return this.http.fetch(MachineService.ENDPOINT);
    }

    public getCoffeeCount(machineId: string): Promise<Response> {
        const resource = `${MachineService.ENDPOINT}/${machineId}/coffee`;
        return this.http.fetch(resource);
    }

}
