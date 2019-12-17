import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient} from 'aurelia-fetch-client';
import {autoinject} from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';

@autoinject
export abstract class Service {
    constructor(protected http: HttpClient,
                protected config: AureliaConfiguration,
                private authService: AuthService) {
        if (!http.isConfigured) {
            const protocol = config.get('api.ssl') ? 'https' : 'http';
            const baseUrl = `${protocol}://${config.get('api.host')}${config.get('api.apiBase')}`;
            http.configure(x => {
                x.withBaseUrl(baseUrl);
            });
        }
    }

    protected authHeader() {
        return { Authorization: this.authService.getAccessToken() }
    }
}
