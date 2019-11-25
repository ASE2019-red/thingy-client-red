import {
    RenderInstruction,
    ValidateResult,
    ValidationRenderer
  } from 'aurelia-validation';

export class BootstrapFormRenderer {

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
            if (!formGroup.classList.contains('has-error')) {
                formGroup.classList.add('has-success');
            }
        } else {
            // add the has-error class to the enclosing form-group div
            formGroup.classList.remove('has-success');
            formGroup.classList.add('has-error');

            // add help-block
            const message = document.createElement('span');
            message.className = 'help-block validation-message';
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
            if (formGroup.classList.contains('has-success')) {
                formGroup.classList.remove('has-success');
            }
        } else {
            // remove help-block
            const message = formGroup.querySelector(`#validation-message-${result.id}`);
            if (message) {
                formGroup.removeChild(message);

                // remove the has-error class from the enclosing form-group div
                if (formGroup.querySelectorAll('.help-block.validation-message').length === 0) {
                    formGroup.classList.remove('has-error');
                }
            }
        }
    }
}
