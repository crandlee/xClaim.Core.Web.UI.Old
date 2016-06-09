System.register(['@angular/core', './shared/security/security.component', '@angular/router', './shared/ng2-toasty/ng2-toasty', './domain.service', './shared/service/core-services.service', './shared/hub/hub.service', '@angular/core/src/facade/async', './shared/scroll/scroll.service', "./shared/off-click/off-click.directive"], function(exports_1, context_1) {
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
    var core_1, security_component_1, router_1, ng2_toasty_1, domain_service_1, core_services_service_1, hub_service_1, async_1, scroll_service_1, off_click_directive_1;
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
            },
            function (hub_service_1_1) {
                hub_service_1 = hub_service_1_1;
            },
            function (async_1_1) {
                async_1 = async_1_1;
            },
            function (scroll_service_1_1) {
                scroll_service_1 = scroll_service_1_1;
            },
            function (off_click_directive_1_1) {
                off_click_directive_1 = off_click_directive_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(scrollService) {
                    this.scrollService = scrollService;
                    this.currentlyWaitingForScroll = false;
                }
                //Setup scroll events (allows infinite paging)
                AppComponent.prototype.onScroll = function (event) {
                    if (!this.currentlyWaitingForScroll) {
                        this.currentlyWaitingForScroll = true;
                        async_1.TimerWrapper.setTimeout(this.onScrollTimerEvent.bind(this, event), 1000);
                    }
                };
                AppComponent.prototype.onScrollTimerEvent = function (event) {
                    this.scrollService.checkNearBottom();
                    this.currentlyWaitingForScroll = false;
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'xcore-app',
                        templateUrl: 'app/app.component.html',
                        styles: ['app/app.component.css'],
                        directives: [security_component_1.SecurityComponent, ng2_toasty_1.Toasty, router_1.ROUTER_DIRECTIVES, off_click_directive_1.OffClickDirective],
                        providers: [core_services_service_1.XCoreServices, hub_service_1.HubService, scroll_service_1.ScrollService]
                    }),
                    router_1.Routes([].concat(domain_service_1.DomainService.getRoutes())), 
                    __metadata('design:paramtypes', [scroll_service_1.ScrollService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map