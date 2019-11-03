import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { AureliaConfiguration } from 'aurelia-configuration';

@autoinject
export class CoffeeService {
    private static readonly ENDPOINT = '';
    
    constructor(private http: HttpClient, private config: AureliaConfiguration) {
        const baseUrl = `${config.get('api.host')}${config.get('api.apiBase')}`;
        http.configure(x => {
            x.withBaseUrl(baseUrl);
        });
    }

}
