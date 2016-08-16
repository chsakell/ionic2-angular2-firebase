import { FormControl } from '@angular/forms';

interface ValidationResult {
    [key: string]: boolean;
}

export class EmailValidator {

    public static isValid(control: FormControl): ValidationResult {
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        let valid = emailReg.test(control.value);

        if (!valid) {
            return { isValid: true };
        }
        return null;
    }
}