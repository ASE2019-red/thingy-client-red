import { autoinject, PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

@autoinject
export class App {
    private router: Router;

    private configureRouter(config: RouterConfiguration, router: Router): void {
        this.router = router;
        config.options.pushState = true;
        config.map([
            { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('routes/coffe-counter/coffee-counter'),
                nav: true, title: 'Coffe counter' },
            { route: 'measurements', name: 'measurements', moduleId: PLATFORM.moduleName('routes/measurement/measurement'),
                nav: true, title: 'Measurements' },
            { route: 'login', name: 'login', moduleId: PLATFORM.moduleName('routes/login/login'),
                nav: true, title: 'Login' },
            { route: 'machine', name: 'machine', moduleId: PLATFORM.moduleName('routes/machine/register-machine'),
                nav: true, title: 'Machines' },
          ]);
    }

}
