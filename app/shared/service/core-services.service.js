System.register(['../../appsettings', '../security/security.service', '../logging/logging.service', './base.service', '@angular/core', '@angular/http', '@angular/router', 'angular2-cookie/core', './busy.service'], function(exports_1, context_1) {
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
    var appsettings_1, security_service_1, logging_service_1, base_service_1, core_1, http_1, router_1, core_2, busy_service_1;
    var XCoreServices, XCoreServiceBase;
    return {
        setters:[
            function (appsettings_1_1) {
                appsettings_1 = appsettings_1_1;
            },
            function (security_service_1_1) {
                security_service_1 = security_service_1_1;
            },
            function (logging_service_1_1) {
                logging_service_1 = logging_service_1_1;
            },
            function (base_service_1_1) {
                base_service_1 = base_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (busy_service_1_1) {
                busy_service_1 = busy_service_1_1;
            }],
        execute: function() {
            XCoreServices = (function () {
                function XCoreServices(LoggingService, AppSettings, SecurityService, Http, Router, CookieService, BusyService) {
                    this.LoggingService = LoggingService;
                    this.AppSettings = AppSettings;
                    this.SecurityService = SecurityService;
                    this.Http = Http;
                    this.Router = Router;
                    this.CookieService = CookieService;
                    this.BusyService = BusyService;
                }
                XCoreServices = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [logging_service_1.LoggingService, appsettings_1.AppSettings, security_service_1.SecurityService, http_1.Http, router_1.Router, core_2.CookieService, busy_service_1.BusyService])
                ], XCoreServices);
                return XCoreServices;
            }());
            exports_1("XCoreServices", XCoreServices);
            XCoreServiceBase = (function (_super) {
                __extends(XCoreServiceBase, _super);
                function XCoreServiceBase(xCoreServices) {
                    _super.call(this, xCoreServices);
                }
                XCoreServiceBase = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [XCoreServices])
                ], XCoreServiceBase);
                return XCoreServiceBase;
            }(base_service_1.BaseService));
            exports_1("XCoreServiceBase", XCoreServiceBase);
        }
    }
});
//# sourceMappingURL=core-services.service.js.map