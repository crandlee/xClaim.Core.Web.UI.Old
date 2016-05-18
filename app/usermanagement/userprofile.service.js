System.register(['rxjs/Observable', '@angular/core', 'rxjs/add/operator/map', 'rxjs/add/operator/catch', 'rxjs/add/observable/throw', '../shared/service/core-services.service'], function(exports_1, context_1) {
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
    var Observable_1, core_1, core_services_service_1;
    var UserProfileService;
    return {
        setters:[
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_1) {},
            function (_2) {},
            function (_3) {},
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            }],
        execute: function() {
            UserProfileService = (function (_super) {
                __extends(UserProfileService, _super);
                function UserProfileService(xCoreServices) {
                    _super.call(this, xCoreServices);
                    _super.prototype.setApiController.call(this, 'UserProfile');
                }
                UserProfileService.prototype.getUserProfile = function () {
                    return _super.prototype.getData.call(this)
                        .map(function (res) { return res.json(); })
                        .catch(function (err, caught) {
                        return Observable_1.Observable.throw('There was a problem');
                    });
                };
                UserProfileService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices])
                ], UserProfileService);
                return UserProfileService;
            }(core_services_service_1.XCoreServiceBase));
            exports_1("UserProfileService", UserProfileService);
        }
    }
});
//# sourceMappingURL=userprofile.service.js.map