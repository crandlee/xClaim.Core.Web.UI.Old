import { ValidationService, IValidationOptions, IFormValidationResult } from '../shared/validation/validation.service';
import { LoggingService } from '../shared/logging/logging.service';
import { Control, ControlGroup, AbstractControl } from '@angular/common';
import { ValidatorFn, AsyncValidatorFn } from '@angular/common/src/forms/directives/validators';


export class UserProfileValidationService extends ValidationService {
    
    private static passwordsDoNotMatch: string = "passwordsDoNoMatch";
    
    constructor(loggingService: LoggingService) {
        super(loggingService);
    }
    
    public static passwordCompare(form: ControlGroup) {
        var passwordControl: AbstractControl = form.controls["PasswordControl"];
        var confirmPasswordControl: AbstractControl = form.controls["ConfirmPasswordControl"];
        
        return { [UserProfileValidationService.passwordsDoNotMatch] : passwordControl.value !== confirmPasswordControl.value};
    }

    
    public getValidatorErrorMessage(code: string) {
        let config = {
            [UserProfileValidationService.passwordsDoNotMatch]: "Passwords must match"
        };
        return config[code] ||  super.getValidatorErrorMessage(code);
    }

}