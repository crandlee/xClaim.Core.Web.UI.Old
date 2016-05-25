System.register(['@angular/http', 'rxjs/Observable', '@angular/core', './core-services.service', 'rxjs/add/operator/finally', 'rxjs/add/observable/empty'], function(exports_1, context_1) {
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
    var http_1, Observable_1, core_1, core_services_service_1;
    var BaseService;
    return {
        setters:[
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (_1) {},
            function (_2) {}],
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
                BaseService.prototype.executeObservable = function (obs) {
                    if (this.passedAuthentication()) {
                        this.xCoreServices.BusyService.notifyBusy(true);
                        return obs;
                    }
                    else {
                        //This case shouldn't occur as the user must be authenticated to get here
                        return null;
                    }
                };
                BaseService.prototype.getTextData = function (serviceOptions, routePath, requestOptions, onError) {
                    var baseObs = this.getBaseGetObservable(serviceOptions.ApiController, routePath)
                        .map(function (res) { return res.text(); });
                    var tailObs = this.getTailGetObservable(baseObs, serviceOptions, onError);
                    return this.executeObservable(tailObs);
                };
                BaseService.prototype.getBaseGetObservable = function (apiRoot, controllerUrl, routePath, options) {
                    return this.xCoreServices.Http
                        .get(apiRoot + "/" + controllerUrl + this.getCleanRoutePath(routePath) + "/", this.setHeaders(options));
                };
                BaseService.prototype.getTailGetObservable = function (currentObservable, serviceOptions, onError) {
                    var _this = this;
                    if (!onError)
                        onError = function (error, caught) { _this.xCoreServices.LoggingService.error(error); };
                    var swallowException = (!serviceOptions || !serviceOptions.PropogateException);
                    var suppressDefaultException = (serviceOptions && serviceOptions.SuppressDefaultException);
                    currentObservable = currentObservable
                        .catch(function (err, caught) {
                        if (suppressDefaultException)
                            throw err;
                        var newError = _this.getGeneralErrorMessage("retrieving", serviceOptions);
                        onError(newError, caught);
                        if (swallowException)
                            return Observable_1.Observable.empty();
                        throw newError;
                    });
                    return currentObservable.finally(function () {
                        _this.xCoreServices.BusyService.notifyBusy(false);
                    });
                };
                BaseService.prototype.getGeneralErrorMessage = function (action, serviceOptions) {
                    var dataDescription = serviceOptions && serviceOptions.ServiceDataDescription;
                    if (!dataDescription)
                        dataDescription = "requested data";
                    var errorDescription = serviceOptions && serviceOptions.ServiceError;
                    if (!errorDescription)
                        errorDescription = "There was an error " + action + " the " + dataDescription;
                    return errorDescription;
                };
                BaseService.prototype.getObjectData = function (serviceOptions, routePath, requestOptions, onError) {
                    var baseObs = this.getBaseGetObservable(serviceOptions.ApiRoot, serviceOptions.ApiController, routePath, requestOptions)
                        .map(function (res) { return res.json(); });
                    var tailObs = this.getTailGetObservable(baseObs, serviceOptions, onError);
                    return this.executeObservable(tailObs);
                };
                BaseService.prototype.postData = function (data, serviceOptions, routePath, requestOptions, onError) {
                    var baseObs = this.xCoreServices.Http
                        .post(serviceOptions.ApiRoot + "/" + serviceOptions.ApiController + this.getCleanRoutePath(routePath), JSON.stringify(data), this.setHeaders(requestOptions));
                    var tailObs = this.getTailGetObservable(baseObs, serviceOptions, onError);
                    return this.executeObservable(tailObs);
                };
                BaseService.prototype.putData = function (data, serviceOptions, routePath, requestOptions, onError) {
                    var baseObs = this.xCoreServices.Http
                        .put(serviceOptions.ApiRoot + "/" + serviceOptions.ApiController + this.getCleanRoutePath(routePath), JSON.stringify(data), this.setHeaders(requestOptions));
                    var tailObs = this.getTailGetObservable(baseObs, serviceOptions, onError);
                    return this.executeObservable(tailObs);
                };
                BaseService.prototype.deleteData = function (data, serviceOptions, routePath, requestOptions, onError) {
                    var baseObs = this.xCoreServices.Http
                        .delete(serviceOptions.ApiRoot + "/" + serviceOptions.ApiController + this.getCleanRoutePath(routePath), this.setHeaders(requestOptions));
                    var tailObs = this.getTailGetObservable(baseObs, serviceOptions, onError);
                    return this.executeObservable(tailObs);
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
//# sourceMappingURL=base.service.js.map