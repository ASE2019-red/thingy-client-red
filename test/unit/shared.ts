import { Aurelia, FrameworkConfiguration, PLATFORM } from 'aurelia-framework';
import { History, NavigationOptions } from 'aurelia-history';
import { DOM } from 'aurelia-pal';
import { NavigationInstruction, Next, Router } from 'aurelia-router';

export function configure(aurelia: Aurelia): FrameworkConfiguration {
    return aurelia.use
        .standardConfiguration()
        // .developmentLogging()
        .plugin(PLATFORM.moduleName('aurelia-authentication'))
        .plugin(PLATFORM.moduleName('aurelia-validation'));
}

export function blur(element: Element): Promise<void> {
    element.dispatchEvent(DOM.createCustomEvent('blur', {}));
    return new Promise<void>(resolve => setTimeout(resolve));
}

export function change(element: HTMLInputElement, value: string): Promise<void> {
    element.value = value;
    element.dispatchEvent(DOM.createCustomEvent('change', { bubbles: true }));
    return new Promise<void>(resolve => setTimeout(resolve));
}

export interface MockRouter extends Router {
    url: string;
    route: string;
    params: Record<string, any>;
}

export class MockHistory extends History {

    public activate(opt?: NavigationOptions) {
        return false;
    }
    // tslint:disable-next-line
    public deactivate() { }
    public navigate(fragment: string, opt?: NavigationOptions): boolean {
        return false;
    }
    // tslint:disable-next-line
    public navigateBack() { }
    // tslint:disable-next-line
    public setState(key: any, value: any) { }
    public getState(key: any): any {
        return null;
    }

    public getAbsoluteRoot() {
        return '';
    }

    // tslint:disable-next-line
    setTitle() { }
}

// tslint:disable-next-line
export interface MockInstruction extends NavigationInstruction { }

export class MockInstruction {

    public title: string;

    constructor(title: string) {
        this.title = title;
    }
    // tslint:disable-next-line
    resolve(): void { }
}

export interface MockNext extends Next {
    result: boolean;
    rejection: boolean;
    (): Promise<any>;
    cancel(rejection: any): any;
}

export interface MockPipelineState {
    next: MockNext;
    result: any;
    rejection: any;
}

export function createPipelineState() {
    let nextResult: any = null;
    let cancelResult: any = null;

    const next = (() => {
        nextResult = true;
        return Promise.resolve(nextResult);
    }) as MockNext;

    next.cancel = (rejection) => {
        cancelResult = rejection || 'cancel';
        return Promise.resolve(cancelResult);
    };

    return {
        next,
        get result() { return nextResult; },
        get rejection() { return cancelResult; }
    };
}
