System.register(['@angular/core', '@angular/common', '../shared/validation/validation.component', '../shared/validation/async-validator.service', './userprofile.validation', '../shared/service/core-services.service', '../usermanagement/userprofile.service', '../shared/component/base.component', '../shared/hub/hub.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, validation_component_1, async_validator_service_1, userprofile_validation_1, core_services_service_1, userprofile_service_1, base_component_1, hub_service_1;
    var UserProfileComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (validation_component_1_1) {
                validation_component_1 = validation_component_1_1;
            },
            function (async_validator_service_1_1) {
                async_validator_service_1 = async_validator_service_1_1;
            },
            function (userprofile_validation_1_1) {
                userprofile_validation_1 = userprofile_validation_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (userprofile_service_1_1) {
                userprofile_service_1 = userprofile_service_1_1;
            },
            function (base_component_1_1) {
                base_component_1 = base_component_1_1;
            },
            function (hub_service_1_1) {
                hub_service_1 = hub_service_1_1;
            }],
        execute: function() {
            UserProfileComponent = (function (_super) {
                __extends(UserProfileComponent, _super);
                function UserProfileComponent(xCoreServices, userProfileService, builder, validationService, hubService) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.userProfileService = userProfileService;
                    this.builder = builder;
                    this.validationService = validationService;
                    this.hubService = hubService;
                    this.active = false;
                    this.validationMessages = [];
                    this.initializeTrace("UserProfileComponent");
                }
                UserProfileComponent.prototype.initializeForm = function (builder) {
                    var _this = this;
                    var trace = this.classTrace("initializeForm");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    //Set up any async validators
                    var emailControl = new common_1.Control("", common_1.Validators.compose([common_1.Validators.required, this.validationService.emailValidator]));
                    var emailAsyncValidator = async_validator_service_1.AsyncValidator.debounceControl(emailControl, function (control) { return _this.validationService.isEmailDuplicate(control, _this.userProfileService, _this.userProfile.Id); });
                    //Set up controls            
                    var buildReturn = this.validationService.buildControlGroup(builder, [
                        { controlName: "EMailControl", description: "EMail", control: emailControl },
                        { controlName: "PasswordControl", description: "Password", control: new common_1.Control("", common_1.Validators.compose([common_1.Validators.required, userprofile_validation_1.UserProfileValidationService.passwordStrength])) },
                        { controlName: "ConfirmPasswordControl", description: "Confirm Password", control: new common_1.Control("", common_1.Validators.compose([common_1.Validators.required])) }
                    ]);
                    this.form = buildReturn.controlGroup;
                    this.controlDataDescriptions = buildReturn.controlDataDescriptions;
                    //Initialize all validation
                    this.form.valueChanges.subscribe(function (form) {
                        trace(core_services_service_1.TraceMethodPosition.CallbackStart, "FormChangesEvent");
                        var flv = common_1.Validators.compose([userprofile_validation_1.UserProfileValidationService.passwordCompare]);
                        var flav = common_1.Validators.composeAsync([emailAsyncValidator]);
                        _this.validationService.getValidationResults(_this.form, _this.controlDataDescriptions, flv, flav).then(function (results) {
                            _this.validationMessages = results;
                        });
                        trace(core_services_service_1.TraceMethodPosition.CallbackEnd, "FormChangesEvent");
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserProfileComponent.prototype.getInitialData = function (userProfileService, hubService) {
                    var _this = this;
                    var trace = this.classTrace("getInitialData");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    userProfileService.getUserProfile(this.hubService.HubData.UserId).subscribe(function (up) {
                        trace(core_services_service_1.TraceMethodPosition.CallbackStart);
                        _this.userProfile = _this.userProfileService.userProfileToViewModel(up);
                        _this.active = true;
                        _this.initializeForm(_this.builder);
                        trace(core_services_service_1.TraceMethodPosition.CallbackEnd);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserProfileComponent.prototype.ngOnInit = function () {
                    _super.prototype.NotifyLoaded.call(this, "UserProfile");
                    var trace = this.classTrace("ngOnInit");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.hubService.callbackWhenLoaded(this.getInitialData.bind(this, this.userProfileService, this.hubService));
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                };
                UserProfileComponent.prototype.onSubmit = function () {
                    var _this = this;
                    var trace = this.classTrace("onSubmit");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.userProfileService.saveUserProfile(this.userProfile).subscribe(function (up) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        _this.userProfile = _this.userProfileService.userProfileToViewModel(up);
                        _this.xCoreServices.LoggingService.success("User profile successfully updated");
                        _this.xCoreServices.Router.navigate(["/"]);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserProfileComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/usermanagement/userprofile.component.html',
                        providers: [userprofile_service_1.UserProfileService, userprofile_validation_1.UserProfileValidationService],
                        directives: [validation_component_1.ValidationComponent]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, userprofile_service_1.UserProfileService, common_1.FormBuilder, userprofile_validation_1.UserProfileValidationService, hub_service_1.HubService])
                ], UserProfileComponent);
                return UserProfileComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("UserProfileComponent", UserProfileComponent);
        }
    }
});
//# sourceMappingURL=userprofile.component.js.map