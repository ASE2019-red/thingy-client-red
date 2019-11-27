import { App } from 'app';
import { Container } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

describe('Application routes', () => {
    let app: App;
    let router: Router;
    let routerConfiguration: RouterConfiguration;
    let configureRouter: Promise<void>;

    beforeEach(() => {
        const container = new Container().makeGlobal();
        routerConfiguration = container.get(RouterConfiguration);
        router = container.get(Router);
        app = new App(null, null);
        app.configureRouter(routerConfiguration, router);
        configureRouter = router.configure(routerConfiguration);
        routerConfiguration.exportToRouter(router);
    });

    it.each(['home', 'charts', 'login', 'machines'])('should exist for %s', (rname) => {
        expect(router).not.toBeNull();
        return configureRouter.then(() => {
            const route = router.routes.find((r) => r.name == rname);
            return expect(route).not.toBeNull();
        });
    });
});
