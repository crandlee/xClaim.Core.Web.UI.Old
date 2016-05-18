System.register(['@angular/http', 'rxjs/add/operator/toPromise', '@angular/core', './core-services.service'], function(exports_1, context_1) {
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
    var http_1, core_1, core_services_service_1;
    var BaseService;
    return {
        setters:[
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            }],
        execute: function() {
            BaseService = (function () {
                function BaseService(xCoreServices) {
                    this.xCoreServices = xCoreServices;
                }
                BaseService.prototype.setHeaders = function (options) {
                    if (!options)
                        options = new http_1.RequestOptions();
                    if (!options.headers)
                        options.headers = new http_1.Headers();
                    options.headers.delete('Content-Type');
                    options.headers.delete('Accept');
                    options.headers.delete('Authorization');
                    options.headers.append('Content-Type', 'application/json');
                    options.headers.append('Accept', 'application/json');
                    var token = this.xCoreServices.SecurityService.GetToken();
                    if (token !== "") {
                        options.headers.append('Authorization', 'Bearer ' + token);
                    }
                    return options;
                };
                BaseService.prototype.logError = function (message, options) {
                    this.xCoreServices.LoggingService.error(message, options);
                };
                BaseService.prototype.logSuccess = function (message, options) {
                    this.xCoreServices.LoggingService.success(message, options);
                };
                BaseService.prototype.logWarn = function (message, options) {
                    this.xCoreServices.LoggingService.warn(message, options);
                };
                BaseService.prototype.log = function (message, options) {
                    this.xCoreServices.LoggingService.default(message, options);
                };
                BaseService.prototype.logInfo = function (message, options) {
                    this.xCoreServices.LoggingService.info(message, options);
                };
                BaseService.prototype.logWait = function (message, options) {
                    this.xCoreServices.LoggingService.wait(message, options);
                };
                BaseService.prototype.passedAuthentication = function () {
                    if (this.xCoreServices.SecurityService.checkAuthorized())
                        return true;
                    var currentRoute = this.xCoreServices.Router.serializeUrl(this.xCoreServices.Router.urlTree);
                    this.xCoreServices.CookieService.put(this.xCoreServices.AppSettings.CookieKeys.RouteAfterLoginKey, currentRoute);
                    this.xCoreServices.SecurityService.Authorize();
                    return false;
                };
                BaseService.prototype.getCleanRoutePath = function (routePath) {
                    return routePath ? "/" + routePath : '';
                };
                BaseService.prototype.getData = function (routePath, options) {
                    if (this.passedAuthentication())
                        return this.xCoreServices.Http.get("" + this.actionUrl + this.getCleanRoutePath(routePath) + "/", this.setHeaders(options));
                };
                BaseService.prototype.postData = function (data, routePath, options) {
                    if (this.passedAuthentication())
                        return this.xCoreServices.Http.post("" + this.actionUrl + this.getCleanRoutePath(routePath), JSON.stringify(data), this.setHeaders(options));
                };
                BaseService.prototype.putData = function (data, routePath, options) {
                    if (this.passedAuthentication())
                        return this.xCoreServices.Http.put("" + this.actionUrl + this.getCleanRoutePath(routePath), JSON.stringify(data), this.setHeaders(options));
                };
                BaseService.prototype.deleteData = function (routePath, options) {
                    if (this.passedAuthentication())
                        return this.xCoreServices.Http.delete("" + this.actionUrl + this.getCleanRoutePath(routePath), this.setHeaders(options));
                };
                BaseService.prototype.setApiController = function (relativeUrl) {
                    this.actionUrl = this.xCoreServices.AppSettings.ApiEndpoint + "/" + relativeUrl;
                };
                BaseService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices])
                ], BaseService);
                return BaseService;
            }());
            exports_1("BaseService", BaseService);
        }
    }
});
//# sourceMappingURL=base-service.service.js.map