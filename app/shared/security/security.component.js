System.register(['@angular/core', '../service/core-services.service', '../component/base.component', 'ng2-bootstrap', '@angular/common', '../hub/hub.service'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, base_component_1, ng2_bootstrap_1, common_1, hub_service_1;
    var SecurityComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (base_component_1_1) {
                base_component_1 = base_component_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (hub_service_1_1) {
                hub_service_1 = hub_service_1_1;
            }],
        execute: function() {
            SecurityComponent = (function (_super) {
                __extends(SecurityComponent, _super);
                function SecurityComponent(xCoreServices, hubService) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.hubService = hubService;
                    this.isBusy = false;
                    this.isCollapsed = true;
                    this.hubData = { ApiEndpoints: [], MenuItems: [], Scopes: "" };
                    this.initializeTrace("SecurityComponent");
                }
                SecurityComponent.prototype.performPostLoginProcedure = function () {
                    var trace = this.classTrace("performPostLoginProcedure");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.subscribeToIsApplicationBusy();
                    this.retrieveHubData();
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                SecurityComponent.prototype.retrieveHubData = function () {
                    var _this = this;
                    var trace = this.classTrace("retrieveHubData");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    //Set up event subscriptions   
                    this.hubService.HubDataRetrievedEvent.subscribe(function (hubData) {
                        _this.receiveHubDataAndReAuthorize();
                    });
                    this.xCoreServices.LoggingService.debug("Retrieving data from hub at " + this.xCoreServices.AppSettings.HubApiEndpoint, { noToast: true });
                    this.hubService.retrieveHubData();
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                SecurityComponent.prototype.receiveHubDataAndReAuthorize = function () {
                    var trace = this.classTrace("receiveHubDataAndReAuthorize");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.xCoreServices.LoggingService.debug("Retrieved " + this.hubService.HubData.ApiEndpoints.length + " api endpoints and " + this.hubService.HubData.MenuItems.length + " menu items from the hub");
                    this.hubData = this.hubService.HubData;
                    if (this.hubData.Scopes !== this.xCoreServices.AppSettings.HubScopes
                        && this.xCoreServices.SecurityService.getCurrentScopes() == this.xCoreServices.AppSettings.HubScopes) {
                        //Now that hub has returned data, request new authorization with requested scopes
                        //(only if requested scopes are different, which they should be)
                        this.xCoreServices.SecurityService.requestNewScopeAuthorization(this.hubData.Scopes);
                    }
                    else {
                        this.xCoreServices.LoggingService.debug("No more reauthorization needed. Scopes are up to date");
                    }
                    //This call is to allow other components interested in hub data to know it is finalized.
                    this.hubService.triggerHubDataCompletedLoading();
                    this.performPostLoginRouting();
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                SecurityComponent.prototype.performPostLoginRouting = function () {
                    var trace = this.classTrace("performPostLoginRouting");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    //Check for needed routing from post-login (where are previous route was requested and stored)
                    var needRoute = this.xCoreServices.CookieService.get(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey);
                    if (needRoute) {
                        this.xCoreServices.CookieService.remove(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey);
                        this.xCoreServices.Router.navigate([("" + needRoute)]);
                    }
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                SecurityComponent.prototype.login = function () {
                    var trace = this.classTrace("login");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    try {
                        this.xCoreServices.SecurityService.Authorize();
                    }
                    catch (err) {
                        this.xCoreServices.LoggingService.error(JSON.stringify(err));
                    }
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                ;
                SecurityComponent.prototype.resetLocalHubData = function () {
                    this.hubData = { ApiEndpoints: [], MenuItems: [], Scopes: "" };
                };
                SecurityComponent.prototype.logout = function () {
                    var trace = this.classTrace("logout");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    try {
                        this.xCoreServices.SecurityService.Logoff();
                        this.loggedIn = false;
                        this.isCollapsed = true;
                        this.resetLocalHubData();
                        this.xCoreServices.Router.navigate(['/']);
                    }
                    catch (err) {
                        this.xCoreServices.LoggingService.error(JSON.stringify(err));
                    }
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                ;
                SecurityComponent.prototype.ngOnInit = function () {
                    var trace = this.classTrace("ngOnInit");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    _super.prototype.NotifyLoaded.call(this, "Security");
                    try {
                        this.loggedIn = this.xCoreServices.SecurityService.checkAuthorized();
                        this.userName = this.xCoreServices.SecurityService.getUserName();
                        this.performPostLoginProcedure();
                    }
                    catch (err) {
                        this.xCoreServices.LoggingService.error(JSON.stringify(err));
                    }
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                ;
                SecurityComponent.prototype.navigateToRoute = function (route) {
                    var trace = this.classTrace("navigateToRoute");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (!route)
                        return;
                    this.xCoreServices.Router.navigate([route]);
                    this.isCollapsed = true;
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                SecurityComponent.prototype.subscribeToIsApplicationBusy = function () {
                    var _this = this;
                    var trace = this.classTrace("subscribeToIsApplicationBusy");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.xCoreServices.BusyService.notifyBusy$.subscribe(function (busyCount) {
                        trace(core_services_service_1.TraceMethodPosition.Callback, "notifyBusy " + busyCount);
                        _this.isBusy = (busyCount > 0);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                SecurityComponent = __decorate([
                    core_1.Component({
                        selector: 'xcore-security',
                        templateUrl: 'app/shared/security/security.component.html',
                        styleUrls: ['app/shared/security/security.component.css'],
                        directives: [ng2_bootstrap_1.CollapseDirective, ng2_bootstrap_1.DROPDOWN_DIRECTIVES, common_1.CORE_DIRECTIVES],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, hub_service_1.HubService])
                ], SecurityComponent);
                return SecurityComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("SecurityComponent", SecurityComponent);
        }
    }
});
//# sourceMappingURL=security.component.js.map