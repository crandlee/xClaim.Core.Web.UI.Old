import { Control, ControlGroup, AbstractControl, FormBuilder } from '@angular/common';
import _ from 'lodash';
import { Injectable } from '@angular/core';
import { LoggingService, TraceMethodPosition } from '../logging/logging.service';
import { ValidatorFn, AsyncValidatorFn } from '@angular/common/src/forms/directives/validators';

@Injectable()
export class ValidationService {
    
    protected classTrace: (methodName: string) => (methodPosition: TraceMethodPosition, extraMessage?: string) => void;

    private static passwordNotStrong: string = "passwordNotStrong";
    private static required: string = "required";
    private static invalidEmailAddress: string = "invalidEmailAddress";

    public getValidatorErrorMessage(code: string): string {
        let config = {
            [ValidationService.required]: "Required",
            [ValidationService.invalidEmailAddress]: "Invalid email address",
            [ValidationService.passwordNotStrong]: "The password must be at least 9 characters containing one upper, lower, numeric, and symbol character"
        };

        return config[code] || `Unknown Error (key = ${code})`;
    }

    constructor(protected loggingService: LoggingService) {
        this.classTrace = this.loggingService.getTraceFunction("ValidationService");
    }
    
    public static passwordStrength(passwordControl: AbstractControl): IValidationResult {
        
        if (passwordControl.value.match(/(?=.{9,})(?=.*?[^\w\s])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*/)) {
            return null;
        } else {
            return { [ValidationService.passwordNotStrong]: true };
        }
        
    }

    public static emailValidator(control): IValidationResult {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { [ValidationService.invalidEmailAddress]: true };
        }
    }

    public getValidationResults(controlGroup: ControlGroup, controlDescriptions: string[], 
        formLevelValidation?: ValidatorFn, asyncFormLevelValidation?: AsyncValidatorFn, options?: IValidationOptions): Promise<IFormValidationResult[]> {
        
        var trace = this.classTrace("getValidationResults");
        trace(TraceMethodPosition.Entry);
        
        var dirtyOnly = (options && options.dirtyOnly || false);
                    
        //Process form level validation not attached to any particular control
        var flv: IFormValidationResult[] = [];
        var flp: Promise<IFormValidationResult[]>;
        if (formLevelValidation || asyncFormLevelValidation) {
            flp = this.processFormLevelValidation(controlGroup, formLevelValidation, asyncFormLevelValidation);
        } else {
            flp = Promise.resolve([]);
        }
        
        //Build form validation results from control-level validation/form-level validation
        var clp = flp.then(flv => {
            return new Promise(resolve => {
                var ret = _.map(this.processControlLevelValidation(controlGroup, controlDescriptions, dirtyOnly), ce => {
                    var res = <IFormValidationResult>{ control: ce.control, message: this.getValidatorErrorMessage(ce.error), controlDescription: ce.controlDescription, 
                        type: ValidationResultType.Error, getMessage: () => { return res.controlDescription + ": " + res.message; } }; 
                    return res;   
                }).concat(flv);
                resolve(ret);
            });
                        
        });
                                  
        trace(TraceMethodPosition.Exit);
        return clp;
        
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
    
    private processFormLevelValidation(controlGroup: ControlGroup, formLevelValidation: ValidatorFn, asyncFormLevelValidation: AsyncValidatorFn): Promise<IFormValidationResult[]> {
        
        var trace = this.classTrace("processFormLevelValidation");
        trace(TraceMethodPosition.Entry);

        var formLevelResultsPromise = new Promise<IFormValidationResult[]>((resolve,reject) => {
            var formLevelResults = [];
            if (formLevelValidation)
                formLevelResults = formLevelResults.concat(this.buildValidationResultsFromValidatorResults(formLevelValidation(controlGroup))); 
                
            if (asyncFormLevelValidation) {
                asyncFormLevelValidation(controlGroup).then(results => {
                    formLevelResults = formLevelResults.concat(this.buildValidationResultsFromValidatorResults(results));
                    trace(TraceMethodPosition.Exit);
                    resolve(formLevelResults);
                    return;
                }, err => {
                    this.loggingService.error(err, "Unable to complete validation. An error occurred");
                    reject(err);
                });
            } else {
                resolve(formLevelResults);                
            }
        });            
        trace(TraceMethodPosition.Exit);
        return formLevelResultsPromise;
        
    }
    
    
    private buildValidationResultsFromValidatorResults(results: any): IFormValidationResult[] {

        var trace = this.classTrace("buildValidationResultsFromValidatorResults");
        trace(TraceMethodPosition.Entry);

        var ret = _.chain(results)            
            .pickBy(flv => flv === true)
            .map((flv, flr) => {
                var res = <IFormValidationResult>{ control: null, message: this.getValidatorErrorMessage(flr), controlDescription: null, 
                    type: ValidationResultType.Error, getMessage: () => { return res.message; }};
                return res;  
            }).value();
            
        trace(TraceMethodPosition.Exit);
        return ret;
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

export interface IValidationResult {
    [key:string]: boolean;
}
