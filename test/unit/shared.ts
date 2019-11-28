import { Aurelia, FrameworkConfiguration, PLATFORM } from 'aurelia-framework';
import { DOM } from 'aurelia-pal';

export function configure(aurelia: Aurelia): FrameworkConfiguration {
  return aurelia.use
    .standardConfiguration()
    // .developmentLogging()
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