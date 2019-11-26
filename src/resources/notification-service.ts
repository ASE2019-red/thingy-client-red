import {singleton} from 'aurelia-framework';
import {Service} from './service';

@singleton()
export class NotificationService extends Service {
    private static readonly ENDPOINT = 'notifications';

    public getNotifiers(): Promise<Response> {
        return this.http.fetch(`${NotificationService.ENDPOINT}/notifiers`);
    }
}
