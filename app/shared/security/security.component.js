System.register(['@angular/core', '../service/core-services.service', 'ng2-bootstrap', '@angular/common', '../hub/hub.service'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, ng2_bootstrap_1, common_1, hub_service_1;
    var SecurityComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
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
            SecurityComponent = (function () {
                function SecurityComponent(xCoreServices, hubService) {
                    this.xCoreServices = xCoreServices;
                    this.hubService = hubService;
                    this.isBusy = false;
                    this.disabled = false;
                    this.status = { isopen: false };
                    this.isCollapsed = true;
                }
                SecurityComponent.prototype.toggleDropdown = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    this.status.isopen = !this.status.isopen;
                };
                SecurityComponent.prototype.performPostLoginProcedure = function () {
                    this.subscribeToIsApplicationBusy();
                    this.retrieveHubData();
                    this.performPostLoginRouting();
                };
                SecurityComponent.prototype.retrieveHubData = function () {
                    this.hubService.getHubData().subscribe(function (hubData) {
                        console.log(hubData);
                    });
                };
                SecurityComponent.prototype.recheckAuthenticationWithNewScopes = function () {
                };
                SecurityComponent.prototype.performPostLoginRouting = function () {
                    //Check for needed routing from post-login (where are previous route was requested and stored)
                    var needRoute = this.xCoreServices.CookieService.get(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey);
                    if (needRoute) {
                        this.xCoreServices.CookieService.remove(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey);
                        this.xCoreServices.Router.navigate([("" + needRoute)]);
                    }
                };
                SecurityComponent.prototype.login = function () {
                    try {
                        this.xCoreServices.SecurityService.Authorize();
                    }
                    catch (err) {
                        this.xCoreServices.LoggingService.error(JSON.stringify(err));
                    }
                };
                ;
                SecurityComponent.prototype.logout = function () {
                    try {
                        this.xCoreServices.SecurityService.Logoff();
                        this.loggedIn = false;
                        this.isCollapsed = true;
                        this.xCoreServices.Router.navigate(['/']);
                    }
                    catch (err) {
                        this.xCoreServices.LoggingService.error(JSON.stringify(err));
                    }
                };
                ;
                SecurityComponent.prototype.ngOnInit = function () {
                    try {
                        this.loggedIn = this.xCoreServices.SecurityService.checkAuthorized();
                        this.userName = this.xCoreServices.SecurityService.getUserName();
                        this.performPostLoginProcedure();
                    }
                    catch (err) {
                        this.xCoreServices.LoggingService.error(JSON.stringify(err));
                    }
                };
                ;
                SecurityComponent.prototype.navigateToRoute = function (route) {
                    this.xCoreServices.Router.navigate([route]);
                };
                SecurityComponent.prototype.subscribeToIsApplicationBusy = function () {
                    var _this = this;
                    this.xCoreServices.BusyService.notifyBusy$.subscribe(function (busyCount) {
                        _this.isBusy = (busyCount > 0);
                    });
                };
                SecurityComponent = __decorate([
                    core_1.Component({
                        selector: 'xcore-security',
                        templateUrl: 'app/shared/security/security.component.html',
                        styleUrls: ['app/shared/security/security.component.css'],
                        directives: [ng2_bootstrap_1.CollapseDirective, ng2_bootstrap_1.DROPDOWN_DIRECTIVES, common_1.CORE_DIRECTIVES],
                        providers: [core_services_service_1.XCoreServices, hub_service_1.HubService]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, hub_service_1.HubService])
                ], SecurityComponent);
                return SecurityComponent;
            }());
            exports_1("SecurityComponent", SecurityComponent);
        }
    }
});
//# sourceMappingURL=security.component.js.map