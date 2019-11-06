import { AureliaConfiguration } from 'aurelia-configuration';
import { Aurelia, LogManager } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature(PLATFORM.moduleName('resources/index'))
        .plugin(PLATFORM.moduleName('aurelia-configuration'), (config) => {
            const env = process.env.AU_ENV || 'develop';
            console.log(env);
            config.setDirectory('./config/');
            config.setConfig('environments.json');
            config.setEnvironment(env);

        });

    aurelia.start().then(() => {
        const config = aurelia.container.get(AureliaConfiguration);
        if (!config.get('debug')) {
            LogManager.setLevel(LogManager.logLevel.debug);
        }
        aurelia.setRoot(PLATFORM.moduleName('app'));
    });
}
