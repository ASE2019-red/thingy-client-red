import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { Login } from './../../src/routes/login/login';
import { configure } from './shared';

describe('Login validation', () => {
    let tester: ComponentTester<Login>;
    let viewModel: Login;

    beforeEach(() => {

        tester = StageComponent
            .withResources<Login>(PLATFORM.moduleName('routes/login/login'))
            .inView('<login></login>')
            .boundTo({});

        tester.bootstrap(configure);
    });

    it('should be invalid', (done: () => void) => {
        tester.create(bootstrap as any)
            .then(async () => {
                viewModel = tester.viewModel;
                const result = await tester.viewModel.validate();
                expect(result).toBeFalsy();
            })
            .then(done);
    });

    it('should be valid', (done: () => void) => {
        tester.create(bootstrap as any)
            .then(async () => {
                viewModel = tester.viewModel;
                viewModel.password = '1234';
                viewModel.email = 'janedoe@test.ch';
                const result = await tester.viewModel.validate();
                expect(result).toBeTruthy();
            })
            .then(done);
    });

    afterEach(() => {
        tester.dispose();
    });
});
