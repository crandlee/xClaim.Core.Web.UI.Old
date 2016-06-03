System.register(['rxjs/Observable', 'rxjs/add/operator/debounceTime', 'rxjs/add/operator/distinctUntilChanged', '@angular/common'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Observable_1, common_1;
    var AsyncValidator;
    return {
        setters:[
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (_1) {},
            function (_2) {},
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            AsyncValidator = (function () {
                function AsyncValidator(validator, debounceTime) {
                    var _this = this;
                    if (debounceTime === void 0) { debounceTime = 1000; }
                    var source = new Observable_1.Observable(function (observer) {
                        _this._validate = function (control) { return observer.next(control); };
                    });
                    source.debounceTime(debounceTime)
                        .map(function (x) { return { control: x.control, promise: validator(x.control), resolver: x.promiseResolver }; })
                        .subscribe(function (x) {
                        return x.promise.then(function (resultValue) {
                            //Take over error handling for control level validation and handle manually
                            //Form-level validation (instanceOf ControlGroup) will continue to be passed for the pipe
                            if (x.control && x.control instanceof common_1.Control && resultValue) {
                                x.control.setErrors(resultValue, false);
                                return x.resolver(null);
                            }
                            return x.resolver(resultValue);
                        });
                    }, function (e) { console.log('async validator error: %s', e); });
                }
                AsyncValidator.prototype._getValidator = function () {
                    var _this = this;
                    return function (control) {
                        var promiseResolver;
                        var p = new Promise(function (resolve) {
                            promiseResolver = resolve;
                        });
                        _this._validate({ control: control, promiseResolver: promiseResolver });
                        return p;
                    };
                };
                AsyncValidator.prototype._getValidatorControl = function (control) {
                    var _this = this;
                    return function () {
                        var promiseResolver;
                        var p = new Promise(function (resolve) {
                            promiseResolver = resolve;
                        });
                        _this._validate({ control: control, promiseResolver: promiseResolver });
                        return p;
                    };
                };
                AsyncValidator.debounceControl = function (control, validator, debounceTime) {
                    if (debounceTime === void 0) { debounceTime = 400; }
                    var asyncValidator = new this(validator, debounceTime);
                    return asyncValidator._getValidatorControl(control);
                };
                AsyncValidator.debounceForm = function (validator, debounceTime) {
                    if (debounceTime === void 0) { debounceTime = 400; }
                    var asyncValidator = new this(validator, debounceTime);
                    return asyncValidator._getValidator();
                };
                return AsyncValidator;
            }());
            exports_1("AsyncValidator", AsyncValidator);
        }
    }
});
//# sourceMappingURL=async-validator.service.js.map