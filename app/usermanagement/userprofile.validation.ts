import { ValidationService, IValidationOptions, IFormValidationResult, IValidationResult } from '../shared/validation/validation.service';
import { LoggingService, TraceMethodPosition } from '../shared/logging/logging.service';
import { Control, ControlGroup, AbstractControl } from '@angular/common';
import { ValidatorFn, AsyncValidatorFn } from '@angular/common/src/forms/directives/validators';
import { UserProfileService } from './userprofile.service';
import 'rxjs/add/operator/toPromise';

export class UserProfileValidationService extends ValidationService {
    
    private static passwordsDoNotMatch: string = "passwordsDoNoMatch";
    private static emailNotUnique: string = "emailNotUnique";
    private static passwordNotStrong: string = "passwordNotStrong";
    
    constructor(loggingService: LoggingService) {
        super(loggingService);
        this.classTrace = this.loggingService.getTraceFunction("UserProfileValidationService");
    }
    
    public static passwordStrength(passwordControl: AbstractControl): IValidationResult {
        
        if (passwordControl.value.match(/(?=.{9,})(?=.*?[^\w\s])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*/)) {
            return null;
        } else {
            return { "passwordNotStrong": true };
        }
        
    }
    
    public isEmailDuplicate(emailControl: AbstractControl, userProfileService: UserProfileService, id: string): Promise<IValidationResult> {
        var trace = this.classTrace("isEmailDuplicated");
        
        if (!id || !emailControl.value) return Promise.resolve(null);
        
        var svc = userProfileService.isEmailDuplicate(emailControl.value, id);                            
        var p = new Promise<IValidationResult>(resolve => {
            svc.subscribe(isDuplicate => {
                trace(TraceMethodPosition.Callback, "isEmailDuplicate");
                resolve(isDuplicate ? {[UserProfileValidationService.emailNotUnique] : true}: null);                                
            });            
        });  
        
        trace(TraceMethodPosition.Exit);            
        return p;
    }
    
    public static passwordCompare(form: ControlGroup): IValidationResult {
        var passwordControl: AbstractControl = form.controls["PasswordControl"];
        var confirmPasswordControl: AbstractControl = form.controls["ConfirmPasswordControl"];
        
        return { [UserProfileValidationService.passwordsDoNotMatch] : passwordControl.value !== confirmPasswordControl.value};
    }

    
    public getValidatorErrorMessage(code: string): string {
        let config = {
            [UserProfileValidationService.passwordsDoNotMatch]: "Passwords must match",
            [UserProfileValidationService.emailNotUnique]: "This email address is already attached to another user",
            [UserProfileValidationService.passwordNotStrong]: "The password must be at least 9 characters containing one upper, lower, numeric, and symbol character"
        };
        return config[code] ||  super.getValidatorErrorMessage(code);
    }

}