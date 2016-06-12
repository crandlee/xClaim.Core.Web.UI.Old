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
    var ClaimDefinitionsService;
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
            ClaimDefinitionsService = (function (_super) {
                __extends(ClaimDefinitionsService, _super);
                function ClaimDefinitionsService(xCoreServices, hubService) {
                    _super.call(this, xCoreServices);
                    this.hubService = hubService;
                    this.endpointKey = 'xClaim.Core.Web.Api.Security';
                    this.classTrace = this.xCoreServices.LoggingService.getTraceFunction("UserService");
                }
                ClaimDefinitionsService.prototype.get = function (skip, take, toServerFilter) {
                    var _this = this;
                    var trace = this.classTrace("get");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (!skip)
                        skip = 0;
                    if (!take)
                        take = this.xCoreServices.AppSettings.DefaultPageSize;
                    var url = "claimdefinitions?skip=" + skip + "&take=" + take;
                    var obs = this.getObjectData(this.getOptions(this.hubService, this.endpointKey, "There was an error retrieving the claim definitions"), url)
                        .map(function (cds) {
                        var vm = lodash_1.default.map(cds, function (cd) { return _this.toViewModel(cd); });
                        return { Rows: vm };
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                ClaimDefinitionsService.prototype.getNonCoreDefinitions = function () {
                    var trace = this.classTrace("getNonCoreDefinitions");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.get(null, null, {}).map(function (cd) {
                        cd.Rows = lodash_1.default.filter(cd.Rows, function (r) { return ['given_name', 'email', 'sub', 'name'].indexOf(r.Name) === -1; });
                        return cd;
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                ClaimDefinitionsService.prototype.toModel = function (vm) {
                    return {
                        Id: vm.Id,
                        Name: vm.Name,
                        Description: vm.Description
                    };
                };
                ClaimDefinitionsService.prototype.toViewModel = function (model) {
                    return {
                        Id: model.Id,
                        Name: model.Name,
                        Description: model.Description
                    };
                };
                ClaimDefinitionsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, hub_service_1.HubService])
                ], ClaimDefinitionsService);
                return ClaimDefinitionsService;
            }(core_services_service_1.XCoreServiceBase));
            exports_1("ClaimDefinitionsService", ClaimDefinitionsService);
        }
    }
});
//# sourceMappingURL=claimDefinitions.service.js.map