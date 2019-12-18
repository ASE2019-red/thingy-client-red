import { singleton } from 'aurelia-framework';
import { Service } from './service';

@singleton()
export class MeasurementService extends Service {
    private static readonly ENDPOINT = 'measurements';

    public getMeasurements(): Promise<Response> {
        return this.http.fetch(MeasurementService.ENDPOINT, { headers: this.authHeader() });
    }

    public getSeries(measurementId: string): Promise<Response> {
        const resource = `${MeasurementService.ENDPOINT}/${measurementId}`;
        return this.http.fetch(resource, { headers: this.authHeader() });
    }

}
