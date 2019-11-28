import { AureliaConfiguration } from 'aurelia-configuration';
import { Aurelia, LogManager } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import * as authConfig from '../config/authentication.json';

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature(PLATFORM.moduleName('resources/index'))
        .plugin(PLATFORM.moduleName('aurelia-configuration'), (config) => {
            //aurelia.use.plugin('aurelia-auth', authConfig);
            const env = process.env.AU_ENV || 'develop';
            console.log(env);
            config.setDirectory('./config/');
            config.setConfig('environments.json');
            config.setEnvironment(env);

        })
        // based on: https://aurelia.io/blog/2015/08/24/jwt-authentication-in-aurelia/
        .plugin(PLATFORM.moduleName('aurelia-auth'), baseConfig => {
            baseConfig.configure(authConfig);
        })
        .plugin(PLATFORM.moduleName('aurelia-validation'));

    aurelia.start().then(() => {
        const config = aurelia.container.get(AureliaConfiguration);
        if (!config.get('debug')) {
            LogManager.setLevel(LogManager.logLevel.debug);
        }
        aurelia.setRoot(PLATFORM.moduleName('app'));
    });
}
