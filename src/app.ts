import {AureliaConfiguration} from 'aurelia-configuration';
import {autoinject, PLATFORM} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {NotificationService} from './resources/notification-service';
import 'popper.js';
import 'bootstrap';

@autoinject
export class App {
    private router: Router;
    private notifiers: any[];

    constructor(private notificationService: NotificationService, protected config: AureliaConfiguration) {
    }

    public attached(owningView, myView): void {
        const ws = new WebSocket(`ws://${this.config.get('api.host')}/notifications`);

        ws.addEventListener('message', event => {
            console.log(`Notification received: ${event.data}`);
        });
    }

    private configureRouter(config: RouterConfiguration, router: Router): void {
        this.router = router;
        config.options.pushState = true;
        config.map([
            { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('routes/coffee-counter/coffee-counter'),
                nav: true, title: 'Coffee counter', settings: {class: 'nav-coffee'} },
            { route: 'charts', name: 'charts', moduleId: PLATFORM.moduleName('routes/charts/charts'),
                nav: true, title: 'Charts', settings: {class: 'nav-graph'} },
            { route: 'machine', name: 'machine', moduleId: PLATFORM.moduleName('routes/machine/register-machine'),
                nav: true, title: 'Machines', settings: {class: 'nav-machine'} },
            { route: 'login', name: 'login', moduleId: PLATFORM.moduleName('routes/login/login'),
                nav: true, title: 'Login', settings: {class: 'nav-login'} },
          ]);
    }
}
