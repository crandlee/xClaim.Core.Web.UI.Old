import { Control, ControlGroup, AbstractControl, FormBuilder } from '@angular/common';
import _ from 'lodash';
import { Injectable } from '@angular/core';
import { LoggingService, TraceMethodPosition } from '../logging/logging.service';
import { ValidatorFn, AsyncValidatorFn } from '@angular/common/src/forms/directives/validators';

@Injectable()
export class ValidationService {
    
    private classTrace: (methodName: string) => (methodPosition: TraceMethodPosition, extraMessage?: string) => void;

    public getValidatorErrorMessage(code: string): string {
        let config = {
            "required": "Required",
            "invalidEmailAddress": "Invalid email address",
        };

        return config[code] || `Unknown Error (key = ${code})`;
    }

    constructor(protected loggingService: LoggingService) {
        this.classTrace = this.loggingService.getTraceFunction("ValidationService");
    }
    
    // static creditCardValidator(control) {
    //     // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    //     if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
    //         return null;
    //     } else {
    //         return { "invalidCreditCard": true };
    //     }
    // }

    public static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { "invalidEmailAddress": true };
        }
    }

    public getValidationResults(controlGroup: ControlGroup, controlDescriptions: string[], 
        formLevelValidation?: ValidatorFn, asyncFormLevelValidation?: AsyncValidatorFn, options?: IValidationOptions): IFormValidationResult[] {
        
        var trace = this.classTrace("getValidationResults");
        trace(TraceMethodPosition.Entry);
        
        var dirtyOnly = (options && options.dirtyOnly || false);
                    
        //Process form level validation not attached to any particular control
        var flv: IFormValidationResult[] = [];
        if (formLevelValidation || asyncFormLevelValidation) {
            flv = this.processFormLevelValidation(controlGroup, formLevelValidation, asyncFormLevelValidation);
        }
        
        //Build form validation results from control-level validation/form-level validation        
        var ret = _.map(this.processControlLevelValidation(controlGroup, controlDescriptions, dirtyOnly), ce => {
                var res = <IFormValidationResult>{ control: ce.control, message: this.getValidatorErrorMessage(ce.error), controlDescription: ce.controlDescription, 
                    type: ValidationResultType.Error, getMessage: () => { return res.controlDescription + ": " + res.message; } }; 
                return res;   
            }).concat(flv);
            
        trace(TraceMethodPosition.Exit);
        return ret;
        
    }
    
    private processControlLevelValidation(controlGroup: ControlGroup, controlDescriptions: string[], dirtyOnly: boolean): IControlLevelErrorResult[] {

        var trace = this.classTrace("processControlLevelValidation");
        trace(TraceMethodPosition.Entry);

        var controlErrors: IControlLevelErrorResult[] = [];

        _.chain(controlGroup.controls)
            .values<Control>()
            .map((c, idx) => {
                return { control: c,  description: controlDescriptions[idx]}
            })
            .filter(ctrlDesc => (!dirtyOnly || ctrlDesc.control.dirty) &&  !ctrlDesc.control.valid && !ctrlDesc.control.pending)
            .each(ctrlDesc => {
                _.each(_.keys(ctrlDesc.control.errors),e => {                
                    controlErrors.push({ control: ctrlDesc.control, error: e, controlDescription: ctrlDesc.description })
                });            
            }).value();
        
        trace(TraceMethodPosition.Exit);
        
        return controlErrors;
    }
    
    private processFormLevelValidation(controlGroup: ControlGroup, formLevelValidation: ValidatorFn, asyncFormLevelValidation: AsyncValidatorFn): IFormValidationResult[] {
        var trace = this.classTrace("processFormLevelValidation");
        trace(TraceMethodPosition.Entry);

        var formLevelResults = [];
        if (formLevelValidation) 
            formLevelResults = _.chain(formLevelValidation(controlGroup))
                .pickBy(flv => flv === true)
                .map((flv, flr) => {
                    var res = <IFormValidationResult>{ control: null, message: this.getValidatorErrorMessage(flr), controlDescription: null, 
                        type: ValidationResultType.Error, getMessage: () => { return res.message; }};
                    return res;  
                }).value();
                
        trace(TraceMethodPosition.Exit);
        return formLevelResults;
        
    }
    
    
    public buildControlGroup(builder: FormBuilder, controlDefinitions: IControlDefinition[]): { controlGroup: ControlGroup, controlDataDescriptions: string[] } {
        
        var trace = this.classTrace("buildControlGroup");
        trace(TraceMethodPosition.Entry);

        if (builder == null) throw new Error("Must provide a form builder");
        if (controlDefinitions == null) throw new Error("Must provide a control definition");

        var names = _.map(controlDefinitions, cd => cd.controlName);        
        var descriptions = _.map(controlDefinitions, cd => cd.description);
        var controls = _.map(controlDefinitions, cd => cd.control);
        
        var builderDef = _.zipObject(names, controls);
        var form = builder.group(builderDef);                
        
        trace(TraceMethodPosition.Exit);
        return {
            controlGroup: form,
            controlDataDescriptions: descriptions 
        }
        
    }
    
};

interface IControlLevelErrorResult {
    control: AbstractControl, 
    error: any, 
    controlDescription: string
}

export interface IControlDefinition {
    controlName: string,
    description: string,
    control: Control
}
export interface IFormValidationResult {
    control: Control;
    message: string;
    controlDescription: string;
    type: ValidationResultType;
    getMessage: () => string;
}

export enum ValidationResultType {
    Information,
    Warning,
    Error
}

export interface IValidationOptions {
    dirtyOnly?: boolean;
}