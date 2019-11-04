import { AureliaConfiguration } from 'aurelia-configuration';
import { HttpClient } from 'aurelia-fetch-client';
import { autoinject, singleton } from 'aurelia-framework';
import { Service } from './service';

@singleton()
export class CoffeeService extends Service {
    private static readonly ENDPOINT = 'coffee';

    public getAll(): Promise<Response> {
        return this.http.fetch(CoffeeService.ENDPOINT);
    }

}
