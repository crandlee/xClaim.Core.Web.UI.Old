System.register(['@angular/core', '../shared/service/core-services.service', '../shared/hub/hub.service', 'lodash'], function(exports_1, context_1) {
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
    var UserService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
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
            UserService = (function (_super) {
                __extends(UserService, _super);
                function UserService(xCoreServices, hubService) {
                    _super.call(this, xCoreServices);
                    this.hubService = hubService;
                    this.defaultStatuses = [{ Name: "All", Value: "All" }, { Name: "Enabled", Value: "Enabled" }, { Name: "Disabled", Value: "Disabled" }];
                    this.classTrace = this.xCoreServices.LoggingService.getTraceFunction("UserService");
                }
                UserService.prototype.getOptions = function (serviceError) {
                    var trace = this.classTrace("getEndpoint");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = { ApiRoot: this.hubService.findApiEndPoint('xClaim.Core.Web.Api.Security').ApiRoot, ServiceError: serviceError };
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserService.prototype.get = function (skip, take, toServerFilter) {
                    var _this = this;
                    var trace = this.classTrace("getUsers");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (!skip)
                        skip = 0;
                    if (!take)
                        take = this.xCoreServices.AppSettings.DefaultPageSize;
                    var url = "users?skip=" + skip + "&take=" + take;
                    if (toServerFilter && toServerFilter.UserName)
                        url += "&userName=" + toServerFilter.UserName;
                    if (toServerFilter && toServerFilter.FullName)
                        url += "&fullName=" + toServerFilter.FullName;
                    if (toServerFilter && toServerFilter.Email)
                        url += "&email=" + toServerFilter.Email;
                    if (toServerFilter && toServerFilter.Status && toServerFilter.Status !== "All")
                        url += "&enabled=" + (toServerFilter.Status === "Enabled" ? true : false);
                    var obs = this.getObjectData(this.getOptions("There was an error retrieving the users"), url)
                        .map(function (data) {
                        return { RowCount: data.RowCount,
                            Rows: data.Rows.map(function (r) { return _this.toViewModel(r); }),
                            Statuses: _this.defaultStatuses };
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserService.prototype.getNewUser = function () {
                    var trace = this.classTrace("getNewUser");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.getObjectData(this.getOptions("There was an error starting a new user"), "user/new");
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserService.prototype.getUserProfile = function (userId) {
                    var trace = this.classTrace("getUserProfile");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.getObjectData(this.getOptions("There was an error retrieving the user profile"), "userfromid/" + userId);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserService.prototype.isEmailDuplicate = function (email, userId) {
                    var trace = this.classTrace("isEmailDuplicate");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.getObjectData(this.getOptions("There was an error valdiating the email address"), "userfromemail/" + email + "/isduplicated/" + userId);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserService.prototype.isUserNameDuplicate = function (userName, userId) {
                    var trace = this.classTrace("isUserNameDuplicate");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.getObjectData(this.getOptions("There was an error valdiating the user name"), "userfromusername/" + userName + "/isduplicated/" + userId);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserService.prototype.toModel = function (vm) {
                    var trace = this.classTrace("userProfileToModel");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var up = {
                        Name: vm.Name,
                        Id: vm.Id,
                        SavePassword: vm.Password,
                        ConfirmPassword: vm.ConfirmPassword,
                        SaveGivenName: vm.GivenName,
                        SaveEmailAddress: vm.EmailAddress,
                        Enabled: vm.Enabled,
                        Claims: []
                    };
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return up;
                };
                UserService.prototype.toViewModel = function (model) {
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
                        ConfirmPassword: "Dummy@000",
                        Enabled: model.Enabled,
                        Claims: [].concat(lodash_1.default.map(model.Claims, function (c) { return { Id: c.Id, Name: c.Definition && c.Definition.Name, Description: c.Definition && c.Definition.Description, Value: c.Value }; })),
                        TooltipMessage: "<table>\n                                    <tr>\n                                        <td>User Name:</td><td style=\"padding-left: 5px\">" + model.Name + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td>Full Name:</td><td style=\"padding-left: 5px\">" + ((givenNameClaim && givenNameClaim.Value) || "") + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td>Email:</td><td style=\"padding-left: 5px\">" + ((emailClaim && emailClaim.Value) || "") + "</td>\n                                    </tr>\n                                    <tr>                                        \n                                        <td>Id:</td><td style=\"padding-left: 5px\">" + model.Id + "</td>\n                                    </tr>\n                                  </table>\n                 "
                    };
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return vm;
                };
                UserService.prototype.deleteUser = function (id) {
                    var trace = this.classTrace("deleteUserProfile");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.deleteData(this.getOptions("There was an error deleting the user"), "user/" + id);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserService.prototype.saveUserProfile = function (vm) {
                    var trace = this.classTrace("saveUserProfile");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.postData(this.toModel(vm), this.getOptions("There was an error saving the user profile"), 'user');
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, hub_service_1.HubService])
                ], UserService);
                return UserService;
            }(core_services_service_1.XCoreServiceBase));
            exports_1("UserService", UserService);
        }
    }
});
//# sourceMappingURL=user.service.js.map