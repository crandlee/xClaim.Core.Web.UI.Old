System.register(['@angular/core', './usermanagement/routes', './shared/security/forbidden/forbidden.component', './shared/security/unauthorized/unauthorized.component', './shared/security/login.component', './shared/security/logout.component', './welcome/welcome.component'], function(exports_1, context_1) {
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
    var core_1, routes_1, forbidden_component_1, unauthorized_component_1, login_component_1, logout_component_1, welcome_component_1;
    var DomainService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (routes_1_1) {
                routes_1 = routes_1_1;
            },
            function (forbidden_component_1_1) {
                forbidden_component_1 = forbidden_component_1_1;
            },
            function (unauthorized_component_1_1) {
                unauthorized_component_1 = unauthorized_component_1_1;
            },
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            },
            function (logout_component_1_1) {
                logout_component_1 = logout_component_1_1;
            },
            function (welcome_component_1_1) {
                welcome_component_1 = welcome_component_1_1;
            }],
        execute: function() {
            DomainService = (function () {
                function DomainService() {
                }
                DomainService.getRoutes = function () {
                    var baseRoutes = [
                        { path: '/Forbidden', component: forbidden_component_1.ForbiddenComponent },
                        { path: '/Unauthorized', component: unauthorized_component_1.UnauthorizedComponent },
                        { path: '/Login', component: login_component_1.LoginComponent },
                        { path: '/Logout', component: logout_component_1.LogoutComponent },
                        { path: '/Welcome', component: welcome_component_1.WelcomeComponent }
                    ];
                    return baseRoutes
                        .concat(routes_1.UserManagementRoutes).concat([{ path: '/', component: welcome_component_1.WelcomeComponent }]);
                };
                DomainService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], DomainService);
                return DomainService;
            }());
            exports_1("DomainService", DomainService);
        }
    }
});
//# sourceMappingURL=domain.service.js.map