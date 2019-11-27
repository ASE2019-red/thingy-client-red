import {
    RenderInstruction,
    ValidateResult,
    ValidationRenderer
  } from 'aurelia-validation';

export class BootstrapFormRenderer {

    private readonly groupClass = 'form-group';
    private readonly inputRefClass = 'form-control';
    private readonly validClass = 'is-valid';
    private readonly invalidClass = 'is-invalid';

    public render(instruction: RenderInstruction) {
        for (const { result, elements } of instruction.unrender) {
            for (const element of elements) {
                this.remove(element, result);
            }
        }

        for (const { result, elements } of instruction.render) {
            for (const element of elements) {
                this.add(element, result);
            }
        }
    }

    public add(element: Element, result: ValidateResult) {
        const formGroup = element.parentElement;
        if (!formGroup) {
            return;
        }

        if (result.valid) {
            if (!element.classList.contains(this.invalidClass)) {
                element.classList.add(this.validClass);
            }
        } else {
            // add the has-error class to the enclosing form-group div
            element.classList.remove(this.validClass);
            element.classList.add(this.invalidClass);

            // add help-block
            const message = document.createElement('div');
            message.className = 'invalid-feedback validation-message';
            message.textContent = result.message;
            message.id = `validation-message-${result.id}`;
            formGroup.appendChild(message);
        }
    }

    public remove(element: Element, result: ValidateResult) {
        const formGroup = element.parentElement;
        if (!formGroup) {
            return;
        }

        if (result.valid) {
            if (element.classList.contains(this.validClass)) {
                element.classList.remove(this.validClass);
            }
        } else {
            // remove help-block
            const message = formGroup.querySelector(`#validation-message-${result.id}`);
            if (message) {
                formGroup.removeChild(message);

                // remove the has-error class from the enclosing form-group div
                if (formGroup.querySelectorAll('.validation-message').length === 0) {
                    element.classList.remove(this.invalidClass);
                }
            }
        }
    }
}
