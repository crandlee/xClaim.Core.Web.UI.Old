System.register(['lodash', '@angular/core', '../logging/logging.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var lodash_1, core_1, logging_service_1;
    var ValidationService, ValidationResultType;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (logging_service_1_1) {
                logging_service_1 = logging_service_1_1;
            }],
        execute: function() {
            ValidationService = (function () {
                function ValidationService(loggingService) {
                    this.loggingService = loggingService;
                    this.classTrace = this.loggingService.getTraceFunction("ValidationService");
                }
                ValidationService.prototype.getValidatorErrorMessage = function (code) {
                    var config = {
                        "required": "Required",
                        "invalidEmailAddress": "Invalid email address",
                    };
                    return config[code] || "Unknown Error (key = " + code + ")";
                };
                // static creditCardValidator(control) {
                //     // Visa, MasterCard, American Express, Diners Club, Discover, JCB
                //     if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
                //         return null;
                //     } else {
                //         return { "invalidCreditCard": true };
                //     }
                // }
                ValidationService.emailValidator = function (control) {
                    // RFC 2822 compliant regex
                    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
                        return null;
                    }
                    else {
                        return { "invalidEmailAddress": true };
                    }
                };
                ValidationService.prototype.getValidationResults = function (controlGroup, controlDescriptions, formLevelValidation, asyncFormLevelValidation, options) {
                    var _this = this;
                    var trace = this.classTrace("getValidationResults");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    var dirtyOnly = (options && options.dirtyOnly || false);
                    //Process form level validation not attached to any particular control
                    var flv = [];
                    if (formLevelValidation || asyncFormLevelValidation) {
                        flv = this.processFormLevelValidation(controlGroup, formLevelValidation, asyncFormLevelValidation);
                    }
                    //Build form validation results from control-level validation/form-level validation        
                    var ret = lodash_1.default.map(this.processControlLevelValidation(controlGroup, controlDescriptions, dirtyOnly), function (ce) {
                        var res = { control: ce.control, message: _this.getValidatorErrorMessage(ce.error), controlDescription: ce.controlDescription,
                            type: ValidationResultType.Error, getMessage: function () { return res.controlDescription + ": " + res.message; } };
                        return res;
                    }).concat(flv);
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return ret;
                };
                ValidationService.prototype.processControlLevelValidation = function (controlGroup, controlDescriptions, dirtyOnly) {
                    var trace = this.classTrace("processControlLevelValidation");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    var controlErrors = [];
                    lodash_1.default.chain(controlGroup.controls)
                        .values()
                        .map(function (c, idx) {
                        return { control: c, description: controlDescriptions[idx] };
                    })
                        .filter(function (ctrlDesc) { return (!dirtyOnly || ctrlDesc.control.dirty) && !ctrlDesc.control.valid && !ctrlDesc.control.pending; })
                        .each(function (ctrlDesc) {
                        lodash_1.default.each(lodash_1.default.keys(ctrlDesc.control.errors), function (e) {
                            controlErrors.push({ control: ctrlDesc.control, error: e, controlDescription: ctrlDesc.description });
                        });
                    }).value();
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return controlErrors;
                };
                ValidationService.prototype.processFormLevelValidation = function (controlGroup, formLevelValidation, asyncFormLevelValidation) {
                    var _this = this;
                    var trace = this.classTrace("processFormLevelValidation");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    var formLevelResults = [];
                    if (formLevelValidation)
                        formLevelResults = lodash_1.default.chain(formLevelValidation(controlGroup))
                            .pickBy(function (flv) { return flv === true; })
                            .map(function (flv, flr) {
                            var res = { control: null, message: _this.getValidatorErrorMessage(flr), controlDescription: null,
                                type: ValidationResultType.Error, getMessage: function () { return res.message; } };
                            return res;
                        }).value();
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return formLevelResults;
                };
                ValidationService.prototype.buildControlGroup = function (builder, controlDefinitions) {
                    var trace = this.classTrace("buildControlGroup");
                    trace(logging_service_1.TraceMethodPosition.Entry);
                    if (builder == null)
                        throw new Error("Must provide a form builder");
                    if (controlDefinitions == null)
                        throw new Error("Must provide a control definition");
                    var names = lodash_1.default.map(controlDefinitions, function (cd) { return cd.controlName; });
                    var descriptions = lodash_1.default.map(controlDefinitions, function (cd) { return cd.description; });
                    var controls = lodash_1.default.map(controlDefinitions, function (cd) { return cd.control; });
                    var builderDef = lodash_1.default.zipObject(names, controls);
                    var form = builder.group(builderDef);
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return {
                        controlGroup: form,
                        controlDataDescriptions: descriptions
                    };
                };
                ValidationService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [logging_service_1.LoggingService])
                ], ValidationService);
                return ValidationService;
            }());
            exports_1("ValidationService", ValidationService);
            ;
            (function (ValidationResultType) {
                ValidationResultType[ValidationResultType["Information"] = 0] = "Information";
                ValidationResultType[ValidationResultType["Warning"] = 1] = "Warning";
                ValidationResultType[ValidationResultType["Error"] = 2] = "Error";
            })(ValidationResultType || (ValidationResultType = {}));
            exports_1("ValidationResultType", ValidationResultType);
        }
    }
});
//# sourceMappingURL=validation.service.js.map