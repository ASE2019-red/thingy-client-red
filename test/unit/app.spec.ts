import { App } from 'app';
import { Container } from 'aurelia-framework';
import { AppRouter, PipelineProvider, Router, RouterConfiguration } from 'aurelia-router';
import { MockHistory } from './shared';

describe('Application routes', () => {
    let app: App;
    let router: Router;
    let routerConfiguration: RouterConfiguration;
    let configureRouter: Promise<void>;
    let history: MockHistory;

    beforeEach(() => {
        const container = new Container().makeGlobal();
        routerConfiguration = container.get(RouterConfiguration);
        history = new MockHistory();
        history.getAbsoluteRoot = () => '/';
        router = new AppRouter(
          new Container(),
          history,
          new PipelineProvider(new Container()),
          null
        );

        app = new App(null);
        app.configureRouter(routerConfiguration, router);
        configureRouter = router.configure(routerConfiguration);
        routerConfiguration.exportToRouter(router);
    });

    it.each(['home', 'charts', 'login', 'logout', 'machines',
        'machines/register', 'machines/calibration'])('should exist for %s', (rname) => {
        expect(router).not.toBeNull();
        return configureRouter.then(() => {
            const route = router.routes.find((r) => r.name == rname);
            return expect(route).not.toBeNull();
        });
    });
});
