System.register(['rxjs/Observable', '@angular/core', 'rxjs/add/operator/map', 'rxjs/add/operator/catch', 'rxjs/add/observable/throw', '../service/core-services.service', 'lodash'], function(exports_1, context_1) {
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
    var Observable_1, core_1, core_services_service_1, lodash_1;
    var HubService;
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
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            HubService = (function (_super) {
                __extends(HubService, _super);
                function HubService(xCoreServices) {
                    _super.call(this, xCoreServices);
                    this.hubDataLoaded = false;
                    //Initially set hub client/scope to the hub client scope.  These will
                    //get modified when the hub sends new scopes
                    this.clientId = this.xCoreServices.AppSettings.HubClientId;
                    this.scopes = this.xCoreServices.AppSettings.HubScopes;
                }
                Object.defineProperty(HubService.prototype, "ClientId", {
                    get: function () { return this.clientId; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HubService.prototype, "Scopes", {
                    get: function () { return this.scopes; },
                    enumerable: true,
                    configurable: true
                });
                HubService.prototype.getHubData = function () {
                    var _this = this;
                    if (this.hubDataLoaded)
                        return new Observable_1.Observable();
                    var obs = _super.prototype.getObjectData.call(this, {
                        ApiRoot: this.xCoreServices.AppSettings.HubApiEndpoint,
                        ApiController: this.xCoreServices.AppSettings.HubController,
                        ServiceDataDescription: "Menu Items" });
                    obs.subscribe(function (hb) {
                        //Update with the proper api scopes - hub should not be called again until total refresh
                        _this.clientId = _this.xCoreServices.AppSettings.ApiClientId;
                        _this.scopes = hb.Scopes;
                        _this.apiEndpoints = hb.ApiEndpoints,
                            _this.menuItems = hb.MenuItems,
                            _this.hubDataLoaded = true;
                    });
                    return obs;
                };
                HubService.prototype.getApiEndPoint = function (apiKey) {
                    return lodash_1.default.find(this.apiEndpoints, function (e) { e.ApiKey == apiKey; });
                };
                HubService.prototype.getMenus = function () {
                    return this.menuItems;
                };
                HubService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices])
                ], HubService);
                return HubService;
            }(core_services_service_1.XCoreServiceBase));
            exports_1("HubService", HubService);
        }
    }
});
//# sourceMappingURL=hub.service.js.map