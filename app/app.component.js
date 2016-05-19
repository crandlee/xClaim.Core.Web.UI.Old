System.register(['@angular/core', './shared/security/security.component', '@angular/router', './shared/ng2-toasty/ng2-toasty', './domain.service', './shared/service/core-services.service'], function(exports_1, context_1) {
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
    var core_1, security_component_1, router_1, ng2_toasty_1, domain_service_1, core_services_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (security_component_1_1) {
                security_component_1 = security_component_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (ng2_toasty_1_1) {
                ng2_toasty_1 = ng2_toasty_1_1;
            },
            function (domain_service_1_1) {
                domain_service_1 = domain_service_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(xCoreServices) {
                    this.xCoreServices = xCoreServices;
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'xcore-app',
                        templateUrl: 'app/app.component.html',
                        styles: ['app/app.component.css'],
                        directives: [security_component_1.SecurityComponent, ng2_toasty_1.Toasty, router_1.ROUTER_DIRECTIVES],
                        providers: [core_services_service_1.XCoreServices]
                    }),
                    router_1.Routes([].concat(domain_service_1.DomainService.getRoutes())), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map