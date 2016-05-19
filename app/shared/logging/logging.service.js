System.register(['../xcore-toasty/xcore-toasty.service', '@angular/core', 'lodash'], function(exports_1, context_1) {
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
    var xcore_toasty_service_1, core_1, lodash_1;
    var LoggingService;
    return {
        setters:[
            function (xcore_toasty_service_1_1) {
                xcore_toasty_service_1 = xcore_toasty_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            LoggingService = (function () {
                function LoggingService(xCoreToast) {
                    this.xCoreToast = xCoreToast;
                }
                LoggingService.prototype.performLogging = function (consolePrefix, toastFunc, style, message, toastMessage, options) {
                    if (!options || !options.noToast) {
                        if (!toastMessage)
                            toastMessage = message;
                        var toastOptions = this.setToastOptions(toastMessage, options);
                        toastFunc(toastOptions);
                    }
                    if (!options || !options.noConsole) {
                        var msg = lodash_1.default.isObject(message) ? window.CircularJSON.stringify(message).substring(0, 2000) : message;
                        console.log("%c" + consolePrefix + ": " + msg, "" + style);
                    }
                };
                LoggingService.prototype.error = function (errorMessage, userMessage, options) {
                    this.performLogging("Error", this.xCoreToast.error.bind(this.xCoreToast), 'background: red; color: white', errorMessage, userMessage, options);
                };
                LoggingService.prototype.success = function (message, options) {
                    this.performLogging("Success", this.xCoreToast.success.bind(this.xCoreToast), 'background: green; color: white', message, null, options);
                };
                LoggingService.prototype.default = function (message, options) {
                    this.performLogging("Default", this.xCoreToast.default.bind(this.xCoreToast), 'background: black; color: white', message, null, options);
                };
                LoggingService.prototype.info = function (message, options) {
                    this.performLogging("Info", this.xCoreToast.info.bind(this.xCoreToast), 'background: blue; color: white', message, null, options);
                };
                LoggingService.prototype.warn = function (errorMessage, userMessage, options) {
                    this.performLogging("Warning", this.xCoreToast.warn.bind(this.xCoreToast), 'background: yellow; color: black', errorMessage, userMessage, options);
                };
                LoggingService.prototype.wait = function (message, options) {
                    this.performLogging("Wait", this.xCoreToast.wait.bind(this.xCoreToast), 'background: orange; color: black', message, null, options);
                };
                LoggingService.prototype.setToastOptions = function (message, options) {
                    var msg = lodash_1.default.isObject(message) ? window.CircularJSON.stringify(message).substring(0, 2000) : message;
                    var toastOptions = { message: msg };
                    if (options) {
                        toastOptions.showClose = options.showClose || true;
                        toastOptions.timeout = options.timeout || 5;
                        toastOptions.title = options.title || "";
                    }
                    return toastOptions;
                };
                LoggingService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [xcore_toasty_service_1.XCoreToastService])
                ], LoggingService);
                return LoggingService;
            }());
            exports_1("LoggingService", LoggingService);
        }
    }
});
//# sourceMappingURL=logging.service.js.map