System.register(['@angular/core', '@angular/common', '../shared/validation/validation.service', '../shared/service/core-services.service', '../usermanagement/userprofile.service', '../shared/component/base.component'], function(exports_1, context_1) {
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
    var core_1, common_1, validation_service_1, core_services_service_1, userprofile_service_1, base_component_1;
    var UserProfileComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (validation_service_1_1) {
                validation_service_1 = validation_service_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (userprofile_service_1_1) {
                userprofile_service_1 = userprofile_service_1_1;
            },
            function (base_component_1_1) {
                base_component_1 = base_component_1_1;
            }],
        execute: function() {
            UserProfileComponent = (function (_super) {
                __extends(UserProfileComponent, _super);
                function UserProfileComponent(xCoreServices, userProfileService, builder) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.userProfileService = userProfileService;
                    this.builder = builder;
                    this.active = false;
                    this.initializeTrace("UserProfileComponent");
                    this.EMailControl = new common_1.Control("", common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.emailValidator]));
                    this.form = builder.group({ EMailControl: this.EMailControl });
                }
                UserProfileComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var trace = this.classTrace("ngOnInit");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    _super.prototype.NotifyLoaded.call(this, "UserProfile");
                    this.userProfileService.userProfileObservable.subscribe(function (up) {
                        trace(core_services_service_1.TraceMethodPosition.CallbackStart);
                        _this.userProfile = {
                            UserName: up.UserName,
                            EmailAddress: up.EmailAddress,
                            Password: up.ConfirmPassword,
                            ConfirmPassword: up.ConfirmPassword
                        };
                        _this.active = true;
                        trace(core_services_service_1.TraceMethodPosition.CallbackEnd);
                    });
                    this.userProfileService.getUserProfile();
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserProfileComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/usermanagement/userprofile.component.html',
                        providers: [userprofile_service_1.UserProfileService]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, userprofile_service_1.UserProfileService, common_1.FormBuilder])
                ], UserProfileComponent);
                return UserProfileComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("UserProfileComponent", UserProfileComponent);
        }
    }
});
//# sourceMappingURL=userprofile.component.js.map