System.register(['rxjs/Subject', '@angular/core', 'rxjs/add/operator/map', 'rxjs/add/operator/catch', 'rxjs/add/observable/throw', '../service/core-services.service', 'lodash'], function(exports_1, context_1) {
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
    var Subject_1, core_1, core_services_service_1, lodash_1;
    var HubService;
    return {
        setters:[
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
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
                    this.HubDataRetrievedSource = new Subject_1.Subject();
                    this.HubDataCompletedSource = new Subject_1.Subject();
                    this.HubDataRetrievedEvent = this.HubDataRetrievedSource.asObservable().share();
                    this.HubDataCompletedEvent = this.HubDataCompletedSource.asObservable().share();
                    this.HubDataLoaded = false;
                    this.initializeTrace("HubService");
                    var trace = this.classTrace("constructor");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    //Initially set hub client/scope to the hub client scope.  These will
                    //get modified when the hub sends new scopes
                    this.clientId = this.xCoreServices.AppSettings.ApiClientId;
                    this.scopes = this.xCoreServices.AppSettings.HubScopes;
                    this.id = parseInt(String(Math.random() * 100));
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                }
                Object.defineProperty(HubService.prototype, "Id", {
                    get: function () { return this.id; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HubService.prototype, "HubData", {
                    get: function () { return this.hubData; },
                    enumerable: true,
                    configurable: true
                });
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
                HubService.prototype.getLoggedInGivenName = function () {
                    return this.xCoreServices.SecurityService.getUserName();
                };
                HubService.prototype.retrieveHubData = function () {
                    var _this = this;
                    var trace = this.classTrace("retrieveHubData");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = _super.prototype.getObjectData.call(this, {
                        ApiRoot: this.xCoreServices.AppSettings.HubApiEndpoint,
                        ServiceDataDescription: "Menu Items" }, this.xCoreServices.AppSettings.HubRoute);
                    obs.subscribe(function (hb) {
                        trace(core_services_service_1.TraceMethodPosition.CallbackStart, "HubDataRetrievedEvent");
                        //Update with the proper api scopes - hub should not be called again until total refresh
                        _this.clientId = _this.xCoreServices.AppSettings.ApiClientId;
                        _this.scopes = hb.Scopes;
                        hb.UserId = _this.xCoreServices.SecurityService.getUserId();
                        _this.hubData = hb;
                        _this.HubDataRetrievedSource.next(hb);
                        trace(core_services_service_1.TraceMethodPosition.CallbackEnd, "HubDataRetrievedEvent");
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                HubService.prototype.triggerHubDataCompletedLoading = function () {
                    var trace = this.classTrace("triggerHubDataCompletedLoading");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.HubDataCompletedSource.next(this.hubData);
                    this.HubDataLoaded = true;
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                HubService.prototype.findApiEndPoint = function (apiKey) {
                    var trace = this.classTrace("findApiEndPoint");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var ret = lodash_1.default.find(this.hubData.ApiEndpoints, function (e) { return e.ApiKey === apiKey; });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return ret;
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