System.register(['../shared/validation/validation.service', '../shared/logging/logging.service', 'rxjs/add/operator/toPromise'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var validation_service_1, logging_service_1;
    var UserProfileValidationService;
    return {
        setters:[
            function (validation_service_1_1) {
                validation_service_1 = validation_service_1_1;
            },
            function (logging_service_1_1) {
                logging_service_1 = logging_service_1_1;
            },
            function (_1) {}],
        execute: function() {
            UserProfileValidationService = (function (_super) {
                __extends(UserProfileValidationService, _super);
                function UserProfileValidationService(loggingService) {
                    _super.call(this, loggingService);
                    this.classTrace = this.loggingService.getTraceFunction("UserProfileValidationService");
                }
                UserProfileValidationService.passwordStrength = function (passwordControl) {
                    if (passwordControl.value.match(/(?=.{9,})(?=.*?[^\w\s])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*/)) {
                        return null;
                    }
                    else {
                        return { "passwordNotStrong": true };
                    }
                };
                UserProfileValidationService.prototype.isEmailDuplicate = function (emailControl, userProfileService, id) {
                    var trace = this.classTrace("isEmailDuplicated");
                    if (!id || !emailControl.value)
                        return Promise.resolve(null);
                    var svc = userProfileService.isEmailDuplicate(emailControl.value, id);
                    var p = new Promise(function (resolve) {
                        svc.subscribe(function (isDuplicate) {
                            trace(logging_service_1.TraceMethodPosition.Callback, "isEmailDuplicate");
                            resolve(isDuplicate ? (_a = {}, _a[UserProfileValidationService.emailNotUnique] = true, _a) : null);
                            var _a;
                        });
                    });
                    trace(logging_service_1.TraceMethodPosition.Exit);
                    return p;
                };
                UserProfileValidationService.passwordCompare = function (form) {
                    var passwordControl = form.controls["PasswordControl"];
                    var confirmPasswordControl = form.controls["ConfirmPasswordControl"];
                    return (_a = {}, _a[UserProfileValidationService.passwordsDoNotMatch] = passwordControl.value !== confirmPasswordControl.value, _a);
                    var _a;
                };
                UserProfileValidationService.prototype.getValidatorErrorMessage = function (code) {
                    var config = (_a = {},
                        _a[UserProfileValidationService.passwordsDoNotMatch] = "Passwords must match",
                        _a[UserProfileValidationService.emailNotUnique] = "This email address is already attached to another user",
                        _a[UserProfileValidationService.passwordNotStrong] = "The password must be at least 9 characters containing one upper, lower, numeric, and symbol character",
                        _a
                    );
                    return config[code] || _super.prototype.getValidatorErrorMessage.call(this, code);
                    var _a;
                };
                UserProfileValidationService.passwordsDoNotMatch = "passwordsDoNoMatch";
                UserProfileValidationService.emailNotUnique = "emailNotUnique";
                UserProfileValidationService.passwordNotStrong = "passwordNotStrong";
                return UserProfileValidationService;
            }(validation_service_1.ValidationService));
            exports_1("UserProfileValidationService", UserProfileValidationService);
        }
    }
});
//# sourceMappingURL=userprofile.validation.js.map