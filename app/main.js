System.register(['@angular/platform-browser-dynamic', './shared/ng2-toasty/ng2-toasty', './appsettings', './shared/xcore-toasty/xcore-toasty.service', './shared/logging/logging.service', '@angular/http', '@angular/router', '@angular/core', 'angular2-cookie/core', './shared/security/security.service', './app.component'], function(exports_1, context_1) {
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
    var platform_browser_dynamic_1, ng2_toasty_1, appsettings_1, xcore_toasty_service_1, logging_service_1, http_1, router_1, core_1, core_2, security_service_1, app_component_1;
    var RootExceptionHandler;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (ng2_toasty_1_1) {
                ng2_toasty_1 = ng2_toasty_1_1;
            },
            function (appsettings_1_1) {
                appsettings_1 = appsettings_1_1;
            },
            function (xcore_toasty_service_1_1) {
                xcore_toasty_service_1 = xcore_toasty_service_1_1;
            },
            function (logging_service_1_1) {
                logging_service_1 = logging_service_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (security_service_1_1) {
                security_service_1 = security_service_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            }],
        execute: function() {
            RootExceptionHandler = (function () {
                function RootExceptionHandler(logService) {
                    this.logService = logService;
                }
                RootExceptionHandler.prototype.call = function (error, stackTrace, reason) {
                    if (stackTrace === void 0) { stackTrace = null; }
                    if (reason === void 0) { reason = null; }
                    //NOTE: The toast doesn't work here because we are outside of the UI context.
                    //Hoping angular provides a solution for this later.
                    this.logService.error(error);
                };
                RootExceptionHandler = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [logging_service_1.LoggingService])
                ], RootExceptionHandler);
                return RootExceptionHandler;
            }());
            exports_1("RootExceptionHandler", RootExceptionHandler);
            platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
                ng2_toasty_1.ToastyService, ng2_toasty_1.ToastyConfig, http_1.HTTP_PROVIDERS, appsettings_1.AppSettings, xcore_toasty_service_1.XCoreToastService, logging_service_1.LoggingService, security_service_1.SecurityService, core_2.CookieService,
                router_1.ROUTER_PROVIDERS, core_1.provide(core_1.ExceptionHandler, { useClass: RootExceptionHandler })
            ]);
        }
    }
});
//# sourceMappingURL=main.js.map