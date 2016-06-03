System.register(['@angular/core', 'rxjs/add/operator/map', 'rxjs/add/operator/catch', 'rxjs/add/observable/throw', '../shared/service/core-services.service', '../shared/hub/hub.service', 'lodash'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, hub_service_1, lodash_1;
    var UserProfileService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_1) {},
            function (_2) {},
            function (_3) {},
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (hub_service_1_1) {
                hub_service_1 = hub_service_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            UserProfileService = (function (_super) {
                __extends(UserProfileService, _super);
                function UserProfileService(xCoreServices, hubService) {
                    _super.call(this, xCoreServices);
                    this.hubService = hubService;
                    this.apiController = 'UserProfile';
                    this.classTrace = this.xCoreServices.LoggingService.getTraceFunction("UserProfileService");
                }
                UserProfileService.prototype.getEndpoint = function () {
                    var trace = this.classTrace("getEndpoint");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = { ApiRoot: this.hubService.findApiEndPoint('xClaim.Core.Web.Api.Security').ApiRoot };
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserProfileService.prototype.getUserProfile = function (userId) {
                    var trace = this.classTrace("getUserProfile");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.getObjectData(this.getEndpoint(), "userfromid/" + userId);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserProfileService.prototype.isEmailDuplicate = function (email, userId) {
                    var trace = this.classTrace("getUserProfile");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.getObjectData(this.getEndpoint(), "userfromemail/" + email + "/isduplicated/" + userId);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserProfileService.prototype.userProfileToModel = function (vm) {
                    var trace = this.classTrace("userProfileToModel");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var up = {
                        Name: vm.Name,
                        Id: vm.Id,
                        SavePassword: vm.Password,
                        ConfirmPassword: vm.ConfirmPassword,
                        SaveGivenName: vm.GivenName,
                        SaveEmailAddress: vm.EmailAddress,
                        Claims: []
                    };
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return up;
                };
                UserProfileService.prototype.userProfileToViewModel = function (model) {
                    var trace = this.classTrace("userProfileToModel");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var emailClaim = lodash_1.default.find(model.Claims, function (c) { return c.Definition && c.Definition.Name == "email"; });
                    var givenNameClaim = lodash_1.default.find(model.Claims, function (c) { return c.Definition && c.Definition.Name == "given_name"; });
                    var vm = {
                        Id: model.Id,
                        Name: model.Name,
                        GivenName: (givenNameClaim && givenNameClaim.Value) || "",
                        EmailAddress: (emailClaim && emailClaim.Value) || "",
                        Password: "Dummy@000",
                        ConfirmPassword: "Dummy@000"
                    };
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return vm;
                };
                UserProfileService.prototype.saveUserProfile = function (vm) {
                    var trace = this.classTrace("saveUserProfile");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.postData(this.userProfileToModel(vm), this.getEndpoint(), 'user');
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserProfileService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, hub_service_1.HubService])
                ], UserProfileService);
                return UserProfileService;
            }(core_services_service_1.XCoreServiceBase));
            exports_1("UserProfileService", UserProfileService);
        }
    }
});
//# sourceMappingURL=userprofile.service.js.map