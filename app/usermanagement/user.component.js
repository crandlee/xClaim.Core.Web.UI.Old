System.register(['@angular/core', '@angular/common', '../shared/validation/validation.component', '../shared/validation/async-validator.service', './userprofile.validation', '../shared/service/core-services.service', '../usermanagement/user.service', '../shared/component/base.component', '../shared/hub/hub.service', '@angular/router', 'angular2-ui-switch'], function(exports_1, context_1) {
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
    var core_1, common_1, validation_component_1, async_validator_service_1, userprofile_validation_1, core_services_service_1, user_service_1, base_component_1, hub_service_1, router_1, angular2_ui_switch_1;
    var UserComponent;
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
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (base_component_1_1) {
                base_component_1 = base_component_1_1;
            },
            function (hub_service_1_1) {
                hub_service_1 = hub_service_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (angular2_ui_switch_1_1) {
                angular2_ui_switch_1 = angular2_ui_switch_1_1;
            }],
        execute: function() {
            UserComponent = (function (_super) {
                __extends(UserComponent, _super);
                function UserComponent(xCoreServices, userService, builder, validationService, hubService, routeSegment, elementRef) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.userService = userService;
                    this.builder = builder;
                    this.validationService = validationService;
                    this.hubService = hubService;
                    this.routeSegment = routeSegment;
                    this.elementRef = elementRef;
                    this.active = false;
                    this.validationMessages = [];
                    this.initializeTrace("UserComponent");
                    this.userId = routeSegment.getParam("id");
                    //console.log(this.userId);
                }
                UserComponent.prototype.initializeForm = function (builder) {
                    var _this = this;
                    var trace = this.classTrace("initializeForm");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    //Set up any async validators
                    var emailControl = new common_1.Control("", common_1.Validators.compose([common_1.Validators.required, this.validationService.emailValidator]));
                    var emailAsyncValidator = async_validator_service_1.AsyncValidator.debounceControl(emailControl, function (control) { return _this.validationService.isEmailDuplicate(control, _this.userService, _this.userProfile.Id); });
                    var userNameControl = new common_1.Control("", common_1.Validators.compose([common_1.Validators.required]));
                    var userNameValidator = async_validator_service_1.AsyncValidator.debounceControl(userNameControl, function (control) { return _this.validationService.isUserNameDuplicate(control, _this.userService, _this.userProfile.Id); });
                    //Set up controls            
                    var buildReturn = this.validationService.buildControlGroup(builder, [
                        { controlName: "UserNameControl", description: "User Name", control: userNameControl },
                        { controlName: "FullNameControl", description: "Full Name", control: new common_1.Control("", common_1.Validators.compose([common_1.Validators.required])) },
                        { controlName: "EMailControl", description: "EMail", control: emailControl },
                        { controlName: "PasswordControl", description: "Password", control: new common_1.Control("", common_1.Validators.compose([common_1.Validators.required, userprofile_validation_1.UserProfileValidationService.passwordStrength])) },
                        { controlName: "ConfirmPasswordControl", description: "Confirm Password", control: new common_1.Control("", common_1.Validators.compose([common_1.Validators.required])) },
                        { controlName: "EnabledControl", description: "Enabled", control: new common_1.Control("") }
                    ]);
                    this.form = buildReturn.controlGroup;
                    this.controlDataDescriptions = buildReturn.controlDataDescriptions;
                    //Initialize all validation
                    this.form.valueChanges.subscribe(function (form) {
                        trace(core_services_service_1.TraceMethodPosition.CallbackStart, "FormChangesEvent");
                        var flv = common_1.Validators.compose([userprofile_validation_1.UserProfileValidationService.passwordCompare]);
                        var flav = common_1.Validators.composeAsync([emailAsyncValidator, userNameValidator]);
                        _this.validationService.getValidationResults(_this.form, _this.controlDataDescriptions, flv, flav).then(function (results) {
                            _this.validationMessages = results;
                        });
                        trace(core_services_service_1.TraceMethodPosition.CallbackEnd, "FormChangesEvent");
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserComponent.prototype.getInitialData = function (userService, userId) {
                    var _this = this;
                    var trace = this.classTrace("getInitialData");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var fn = (!this.userId)
                        ? userService.getNewUser.bind(userService)
                        : userService.getUserProfile.bind(userService, this.userId);
                    fn().subscribe(function (up) {
                        trace(core_services_service_1.TraceMethodPosition.CallbackStart);
                        _this.userProfile = _this.userService.toViewModel(up);
                        if (_this.userId == null) {
                            _this.userProfile.Password = "";
                            _this.userProfile.ConfirmPassword = "";
                            _this.userProfile.Enabled = true;
                        }
                        _this.active = true;
                        _this.initializeForm(_this.builder);
                        trace(core_services_service_1.TraceMethodPosition.CallbackEnd);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserComponent.prototype.ngOnInit = function () {
                    _super.prototype.NotifyLoaded.call(this, "User");
                    var trace = this.classTrace("ngOnInit");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.hubService.callbackWhenLoaded(this.getInitialData.bind(this, this.userService, this.userId));
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                };
                UserComponent.prototype.onSubmit = function () {
                    var _this = this;
                    var trace = this.classTrace("onSubmit");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.userService.saveUserProfile(this.userProfile).subscribe(function (up) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        _this.userProfile = _this.userService.toViewModel(up);
                        _this.xCoreServices.LoggingService.success("User successfully saved");
                        _this.xCoreServices.Router.navigate(["/UserManagement"]);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserComponent.prototype.cancel = function () {
                    this.xCoreServices.Router.navigate(["/UserManagement"]);
                };
                UserComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/usermanagement/user.component.html',
                        providers: [user_service_1.UserService, userprofile_validation_1.UserProfileValidationService],
                        directives: [validation_component_1.ValidationComponent, angular2_ui_switch_1.UiSwitchComponent]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, user_service_1.UserService, common_1.FormBuilder, userprofile_validation_1.UserProfileValidationService, hub_service_1.HubService, router_1.RouteSegment, core_1.ElementRef])
                ], UserComponent);
                return UserComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("UserComponent", UserComponent);
        }
    }
});
//# sourceMappingURL=user.component.js.map