import { Control, ControlGroup } from '@angular/common';

interface ValidationResult {
    [key: string]: boolean;
}

export class CheckedValidator {

    public static isChecked(control: Control): ValidationResult {
        var valid = control.value === false || control.value === 'false';
        if (valid) {
            return { isChecked: true };
        }
        return null;
    }
}