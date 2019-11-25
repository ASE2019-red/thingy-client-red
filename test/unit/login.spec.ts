import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { Login } from './../../src/routes/login/login';
import { configure } from './shared';

describe('Login validation', () => {
    let tester: ComponentTester<Login>;
    let sut: Login;
    let renderer;
    let viewModel: Login;

    beforeEach(() => {

        tester = StageComponent
            .withResources<Login>(PLATFORM.moduleName('routes/login/login'))
            .inView('<login></login>')
            .boundTo({});

        tester.bootstrap(configure);
        renderer = { render: jasmine.createSpy() };
    });

    // it('should render first name', done => {
    //     service.firstName = 'Bob';

    //     component.create(bootstrap).then(() => {
    //         const nameElement = document.querySelector('.first-name');
    //         expect(nameElement.innerHTML).toBe('Bob');

    //         done();
    //     });
    // });

    it('should be invalid', (done: () => void) => {
        // tester.create(bootstrap).then(() => {
        //     // const login = tester.viewModel;
        //     // console.log(login);
        //     // const result = tester.viewModel.validate();
        //     // expect(result).toBeFalsy();
        //     done();
        // });
        tester.create(bootstrap as any)
            .then(() => {
                viewModel = tester.viewModel;
        //         viewModel.controller.addRenderer(renderer);
            })
            .then(done);
        // done();
    });

    afterEach(() => {
        // tester.dispose();
    });
});
