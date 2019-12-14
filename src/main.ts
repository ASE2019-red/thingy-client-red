import { AureliaConfiguration } from 'aurelia-configuration';
import { Aurelia, LogManager } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

const authConfig = {
    signupUrl: "user",
    loginOnSignup : true,
    signupRedirect : "/",
    loginUrl: "login",
    loginRedirect: "/",
    logoutRedirect: "login",
    expiredReload : 1,
    tokenName: "token"
}

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

        })
        .plugin(PLATFORM.moduleName('aurelia-authentication'), authConfig)
        .plugin(PLATFORM.moduleName('aurelia-validation'));

    aurelia.start().then(() => {
        const config = aurelia.container.get(AureliaConfiguration);
        if (!config.get('debug')) {
            LogManager.setLevel(LogManager.logLevel.debug);
        }
        aurelia.setRoot(PLATFORM.moduleName('app'));
    });
}
