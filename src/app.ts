import {AuthorizeStep} from 'aurelia-authentication';
import {AureliaConfiguration} from 'aurelia-configuration';
import {autoinject, PLATFORM} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import 'bootstrap';
import 'popper.js';

const NOTIFICATION_TIMEOUT = 10000;
@autoinject
export class App {
    private router: Router;
    private notifications: any[] = [];

    constructor(protected config: AureliaConfiguration) {
    }

    public attached(owningView, myView): void {
        const ws = new WebSocket(`ws://${this.config.get('api.host')}/notifications`);
        ws.addEventListener('message', event => {
            const notification = JSON.parse(event.data);
            this.notifications.push(notification);
            setTimeout(() => {
                this.notifications = this.notifications.filter(n => n !== notification);
                console.log('Notification removed');
            }, NOTIFICATION_TIMEOUT);
            console.log(`Notification received: ${event.data}`);
        });
    }

    public configureRouter(config: RouterConfiguration, router: Router): void {
        this.router = router;
        config.options.pushState = true;
        config.addPipelineStep('authorize', AuthorizeStep);
        config.map([
            { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('routes/coffee-counter/coffee-counter'),
                nav: true, title: 'Coffee counter', settings: {class: 'nav-coffee'}, auth: true },
            { route: 'charts', name: 'charts', moduleId: PLATFORM.moduleName('routes/charts/charts'),
                nav: false, title: 'Charts', settings: {class: 'nav-graph'}, auth: true  },
            { route: 'machine', name: 'machine', moduleId: PLATFORM.moduleName('routes/machine/manage-machines'),
                nav: true, title: 'Machines', settings: {class: 'nav-machine'}, auth: true  },
            { route: 'machine/register', name: 'register', moduleId: PLATFORM.moduleName('routes/machine/register-machine'),
                nav: false, title: 'Register Machines', auth: true  },
            { route: 'machine/calibrate/:id', name: 'calibrate', moduleId: PLATFORM.moduleName('routes/machine/machine-calibration'),
                nav: false, title: 'Calibrate Machine', auth: true  },
            { route: 'login', name: 'login', moduleId: PLATFORM.moduleName('routes/login/login'),
                nav: false, title: 'Login', settings: {class: 'nav-login'} },
            { route: 'logout', name: 'logout', moduleId: PLATFORM.moduleName('routes/login/logout'),
                nav: true, title: 'Logout', settings: {class: 'nav-login'}, auth: true },
            { route: 'user', name: 'user', moduleId: PLATFORM.moduleName('routes/user/profile'),
                nav: false, title: 'User', settings: {class: 'nav-login'}, auth: true },
            { route: 'user/register', name: 'register-user', moduleId: PLATFORM.moduleName('routes/user/register-user'),
                nav: false, title: 'Registration', settings: {class: ''} },
          ]);
    }
}
