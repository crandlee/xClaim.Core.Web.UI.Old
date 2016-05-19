System.register(['@angular/core', '../shared/service/core-services.service', '../usermanagement/userprofile.service', '../shared/component/base.component'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, userprofile_service_1, base_component_1;
    var UserProfileComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
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
                function UserProfileComponent(xCoreServices, userProfileService) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.userProfileService = userProfileService;
                }
                UserProfileComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.userProfileService.getUserProfile().subscribe(function (up) {
                        try {
                            _this.userNames = up.map(function (u) { return u.UserName; });
                        }
                        catch (serr) {
                            _this.xCoreServices.LoggingService.error(serr, "There was an error retrieving the users");
                        }
                    });
                };
                UserProfileComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/usermanagement/userprofile.component.html',
                        providers: [userprofile_service_1.UserProfileService]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, userprofile_service_1.UserProfileService])
                ], UserProfileComponent);
                return UserProfileComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("UserProfileComponent", UserProfileComponent);
        }
    }
});
//# sourceMappingURL=userprofile.component.js.map