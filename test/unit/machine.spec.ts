import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { MachineService } from 'resources/machine-service';
import { RegisterMachine } from './../../src/routes/machine/register-machine';

export class MockMachineService {}

describe('Register machine validation', () => {
    let tester: ComponentTester<RegisterMachine>;
    let viewModel: RegisterMachine;
    const service = new MockMachineService();

    beforeEach(() => {

        tester = StageComponent
            .withResources<RegisterMachine>(PLATFORM.moduleName('routes/machine/register-machine'))
            .inView('<register-machine></register-machine>')
            .boundTo({});

        tester.bootstrap(aurelia => {
            const framework =  aurelia.use.standardConfiguration()
                .plugin(PLATFORM.moduleName('aurelia-validation'));
            aurelia.container.registerInstance(MachineService, service);
            return framework;
        });
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
                viewModel.name = 'office';
                viewModel.sensorIdentifier = 'abc:def:000';
                viewModel.coffeesBeforeMaintenance = 123;
                const result = await tester.viewModel.validate();
                expect(result).toBeTruthy();
            })
            .then(done);
    });

    afterEach(() => {
        tester.dispose();
    });
});
