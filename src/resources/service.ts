import { AuthService } from 'aurelia-authentication';
import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient} from 'aurelia-fetch-client';
import {autoinject} from 'aurelia-framework';

@autoinject
export abstract class Service {

    public static getBaseUrl(config: AureliaConfiguration): string {
        const protocol = config.get('api.ssl') ? 'https' : 'http';
        const baseUrl = `${protocol}://${config.get('api.host')}${config.get('api.apiBase')}`;
        return baseUrl;
    }

    constructor(protected http: HttpClient,
                protected config: AureliaConfiguration,
                private authService: AuthService) {
        if (!http.isConfigured) {
            const baseUrl = Service.getBaseUrl(config);
            http.configure(x => {
                x.withBaseUrl(baseUrl);
            });
        }
    }

    protected authHeader() {
        return { Authorization: this.authService.getAccessToken() };
    }
}
