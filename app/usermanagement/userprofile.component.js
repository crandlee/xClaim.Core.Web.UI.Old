System.register(['@angular/core', '../usermanagement/userprofile.service'], function(exports_1, context_1) {
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
    var core_1, userprofile_service_1;
    var UserProfileComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (userprofile_service_1_1) {
                userprofile_service_1 = userprofile_service_1_1;
            }],
        execute: function() {
            UserProfileComponent = (function () {
                function UserProfileComponent(userProfileService) {
                    this.userProfileService = userProfileService;
                }
                UserProfileComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.userProfileService.getUserProfile().subscribe(function (up) {
                        _this.userName = up.UserName;
                        console.log(up);
                    });
                };
                UserProfileComponent = __decorate([
                    core_1.Component({
                        selector: 'xcore-userprofile',
                        templateUrl: 'app/usermanagement/userprofile.component.html',
                        providers: [userprofile_service_1.UserProfileService]
                    }), 
                    __metadata('design:paramtypes', [userprofile_service_1.UserProfileService])
                ], UserProfileComponent);
                return UserProfileComponent;
            }());
            exports_1("UserProfileComponent", UserProfileComponent);
        }
    }
});
//# sourceMappingURL=userprofile.component.js.map